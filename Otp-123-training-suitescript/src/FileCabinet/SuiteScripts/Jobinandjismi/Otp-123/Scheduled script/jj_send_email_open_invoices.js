/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],

    (email, record, search) => {

        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            // Create sales order search
            var invoiceSearchObj = search.create({
                type: "invoice",
                filters:
                    [
                        ["type", "anyof", "CustInvc"],
                        "AND",
                        ["status", "anyof", "CustInvc:A"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "trandate", label: "Date" }),
                        search.createColumn({ name: "type", label: "Type" }),
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "amount", label: "Amount" }),
                        search.createColumn({ name: "email", label: "Email" }),
                        search.createColumn({ name: "subsidiary", label: "Subsidiary" })
                    ]
            });

            var searchResultCount = invoiceSearchObj.runPaged().count;
            log.debug("invoiceSearchObj result count", searchResultCount);

            // Run the search and prepare email body
            var emailBody = "Open Invoice Details for the customer:<br/><br/>";
            invoiceSearchObj.run().each(function (result) {
                emailBody += "Customer Name: " + result.getValue({ name: 'entity' }) + "<br/>";
                emailBody += " Invoice Document Number: " + result.getValue({ name: 'tranid' }) + "<br/>";
               
                return true;
            });

            // Send email
            var subject = 'Open invoice Details ';
            email.send({
                author: -5,
                recipients: -5,
                subject: subject,
                body: emailBody
            });
        }

        return { execute };

    });