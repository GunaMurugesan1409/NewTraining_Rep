/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/search', 'N/email'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{email} email
 */
    (record, search, email) => {
        /**
         * Defines the function that is executed at the beginning of the map/reduce process and generates the input data.
         * @param {Object} inputContext
         * @param {boolean} inputContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Object} inputContext.ObjectRef - Object that references the input data
         * @typedef {Object} ObjectRef
         * @property {string|number} ObjectRef.id - Internal ID of the record instance that contains the input data
         * @property {string} ObjectRef.type - Type of the record instance that contains the input data
         * @returns {Array|Object|Search|ObjectRef|File|Query} The input data to use in the map/reduce process
         * @since 2015.2
         */

        const getInputData = (inputContext) => {
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["status", "anyof", "SalesOrd:A"],
                    "AND",
                    ["trandate", "within", "today"],
                    "AND",
                    ["mainline", "is", "T"],
                ],
                columns: [
                    search.createColumn({ name: "internalid" }),
                    search.createColumn({ name: "salesrep" }),
                    search.createColumn({ name: "entity" })
                ]
            });
            log.debug("salesorderSearchObj", salesorderSearchObj)
            return salesorderSearchObj;
        }

        /**
         * Defines the function that is executed when the map entry point is triggered. This entry point is triggered automatically
         * when the associated getInputData stage is complete. This function is applied to each key-value pair in the provided
         * context.
         * @param {Object} mapContext - Data collection containing the key-value pairs to process in the map stage. This parameter
         *     is provided automatically based on the results of the getInputData stage.
         * @param {Iterator} mapContext.errors - Serialized errors that were thrown during previous attempts to execute the map
         *     function on the current key-value pair
         * @param {number} mapContext.executionNo - Number of times the map function has been executed on the current key-value
         *     pair
         * @param {boolean} mapContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} mapContext.key - Key to be processed during the map stage
         * @param {string} mapContext.value - Value to be processed during the map stage
         * @since 2015.2
         */

        const map = (mapContext) => {
            var salesOrderId = mapContext.key;
            var salesRepId = mapContext.value['salesrep']; // Extracting sales rep ID from the search result
            var customerId = mapContext.value['entity'];
            log.debug("salesRepId", salesRepId)
            log.debug("salesOrderId", salesOrderId)
            log.debug("customerId", customerId)

            // Update sales order status to "Pending Fulfillment"
            var salesOrderRecord = record.load({ type: record.Type.SALES_ORDER, id: salesOrderId });
            var statusSales = salesOrderRecord.setValue({
                fieldId: 'orderstatus',
                value: 'B'
            });
            log.debug("statusSales", statusSales)
            salesOrderRecord.save();
            // Send email notification

            var emailBody = 'Dear Sales Representative, <br/><br/> The status of the sales order ' + salesOrderId + ' has been updated to Pending Fulfillment.';

            if (salesRepId) {
                // Retrieve the email of the sales rep
                var salesRepEmail = search.lookupFields({
                    type: search.Type.EMPLOYEE,
                    id: salesRepId,
                    columns: ['email']
                }).email;
                var salesRepEmail = salesRepEmail.email;
                log.debug("salesRepEmail", salesRepEmail);
                if (salesRepEmail) {
                    // Send email to sales rep
                    email.send({
                        author: -5, // Administrator
                        recipients: salesRepEmail,
                        subject: 'Sales Order Status Update',
                        body: emailBody,
                        relatedRecords: {
                            typeId: record.Type.SALES_ORDER,
                            id: salesOrderId
                        }
                    });
                } else {
                    log.error('Sales Rep Email Not Found', 'No sales representative email found for the sales rep associated with sales order ID: ' + salesOrderId);
                }
            } else {
                // If there's no sales rep, send email to admin
                email.send({
                    author: -5, // Admin
                    recipients: -5, // Admin
                    subject: 'Sales Order Status Update',
                    body: emailBody,
                    // relatedRecords: {
                    //     typeId: record.Type.SALES_ORDER,
                    //     id: salesOrderId
                    // }
                });
                log.error('Sales Rep Not Found', 'No sales representative found for the customer associated with sales order ID: ' + salesOrderId);
            }
     
        }

        /**
         * Defines the function that is executed when the reduce entry point is triggered. This entry point is triggered
         * automatically when the associated map stage is complete. This function is applied to each group in the provided context.
         * @param {Object} reduceContext - Data collection containing the groups to process in the reduce stage. This parameter is
         *     provided automatically based on the results of the map stage.
         * @param {Iterator} reduceContext.errors - Serialized errors that were thrown during previous attempts to execute the
         *     reduce function on the current group
         * @param {number} reduceContext.executionNo - Number of times the reduce function has been executed on the current group
         * @param {boolean} reduceContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {string} reduceContext.key - Key to be processed during the reduce stage
         * @param {List<String>} reduceContext.values - All values associated with a unique key that was passed to the reduce stage
         *     for processing
         * @since 2015.2
         */
        const reduce = (reduceContext) => {
            // No reduce logic needed in this case
        }


        /**
         * Defines the function that is executed when the summarize entry point is triggered. This entry point is triggered
         * automatically when the associated reduce stage is complete. This function is applied to the entire result set.
         * @param {Object} summaryContext - Statistics about the execution of a map/reduce script
         * @param {number} summaryContext.concurrency - Maximum concurrency number when executing parallel tasks for the map/reduce
         *     script
         * @param {Date} summaryContext.dateCreated - The date and time when the map/reduce script began running
         * @param {boolean} summaryContext.isRestarted - Indicates whether the current invocation of this function is the first
         *     invocation (if true, the current invocation is not the first invocation and this function has been restarted)
         * @param {Iterator} summaryContext.output - Serialized keys and values that were saved as output during the reduce stage
         * @param {number} summaryContext.seconds - Total seconds elapsed when running the map/reduce script
         * @param {number} summaryContext.usage - Total number of governance usage units consumed when running the map/reduce
         *     script
         * @param {number} summaryContext.yields - Total number of yields when running the map/reduce script
         * @param {Object} summaryContext.inputSummary - Statistics about the input stage
         * @param {Object} summaryContext.mapSummary - Statistics about the map stage
         * @param {Object} summaryContext.reduceSummary - Statistics about the reduce stage
         * @since 2015.2
         */
        const summarize = (summaryContext) => {
            // No summarize logic needed in this case
        }

        return { getInputData, map, reduce, summarize }

    });