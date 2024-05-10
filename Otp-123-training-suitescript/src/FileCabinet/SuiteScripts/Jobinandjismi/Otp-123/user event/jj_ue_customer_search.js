/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/search'],
    /**
 * @param{search} search
 */
    (search) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {
                var filters = [
                    search.createFilter({
                        name: 'datecreated',
                        operator: search.Operator.WITHIN,
                        values: ['lastmonth']
                    }),
                    search.createFilter({
                        name: 'subsidiary',
                        operator: search.Operator.IS,
                        values: 'Parent Subsidiary'
                    }),
                 
                ];

                // Define the search columns
                var columns = [
                    search.createColumn({ name: 'entityid', }),
                    search.createColumn({ name: 'subsidiary' }),
                    search.createColumn({ name: 'salesrep' }),
                    search.createColumn({ name: 'email' }),
                    search.createColumn({ name: 'datecreated' })
                ];

                // Create the saved search
                var savedSearch = search.create({
                    type: search.Type.CUSTOMER,
                    title: 'Customers Created Last Month by Parent Subsidiary',
                    savedSearchId:savedSearchId,
                    filters: filters,
                    columns: columns
                });

                // Save the search and log the ID
                var savedSearchId = savedSearch.save();
                log.debug('Saved Search Created', 'ID: ' + savedSearchId);
            
        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
