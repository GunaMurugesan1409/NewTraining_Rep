/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/render', 'N/record', 'N/search', 'N/file'],

    (email, render, record, search, file) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            // Get today's date

            // Create search to find sales orders created today
            const salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: [
                    ["trandate", "within", "today"], // Sales orders created today
                    'AND',
                    ['mainline', 'is', 'T'] // Main line only
                ],
                columns: ['entity', 'tranid']
            });

            // Run the search and process each sales order
            salesOrderSearch.run().each(function (result) {
                const customerId = result.getValue({ name: 'entity' });
                // Load the sales order record
                // var customer = record.load({
                //     type: record.Type.CUSTOMER,
                //     id: customerId
                // });
                // var custId = customer.id;
                // log.debug("custId", custId)
                // var customerEmail = customer.getValue({
                //     fieldId: 'email'
                // });

                // Render PDF of the sales order
                var salesOrderId = parseInt(result.id);
                var salesOrderPdf = render.transaction({
                    entityId: salesOrderId,
                    printMode: render.PrintMode.PDF
                });

                // Get customer email
                const customerEmail = search.lookupFields({
                    type: search.Type.CUSTOMER,
                    id: customerId,
                    columns: ['email']
                }).email;
                log.debug({
                    title: 'Email Details',
                    details: {
                        CustomerEmail: customerEmail,
                        Subject: 'Your Daily Sales Order',
                        Body: 'Dear Customer, Please find attached your daily sales order.',
                        Attachments: [salesOrderPdf],
                    }
                });
                // Send email with PDF attachment
                if (customerEmail) {
                    // Send email with PDF attachment
                    const subject = 'Your Daily Sales Order';
                    const body = 'Dear Customer, Please find attached your daily sales order.';
                    email.send({
                        author: -5, // Admin ID
                        recipients: customerEmail,
                        subject: subject,
                        body: body,
                        attachments: [salesOrderPdf],
                    });
                } else {
                    log.error({ title: 'Missing Email', details: 'Customer email not found for customer ID: ' + customerId });
                }

                return true; // Continue processing next sales order
            });
        }

        return { execute };

    });