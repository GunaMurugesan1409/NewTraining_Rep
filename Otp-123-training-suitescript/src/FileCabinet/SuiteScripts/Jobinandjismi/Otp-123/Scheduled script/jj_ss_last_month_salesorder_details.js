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
            var salesorderSearchObj = search.create({
                type: "salesorder",
                filters: [
                    ["type", "anyof", "SalesOrd"],
                    "AND",
                    ["trandate", "within", "lastmonth"]
                ],
                columns: [
                    search.createColumn({ name: "trandate", label: "Date" }),
                    search.createColumn({ name: "tranid", label: "Document Number" }),
                    search.createColumn({ name: "entity", label: "Name" }),
                    search.createColumn({ name: "memo", label: "Memo" }),
                    search.createColumn({ name: "amount", label: "Amount" })
                ]
            });

            // Run the search and prepare email body
            var emailBody = "Sales Order Details for Last Month:<br/><br/>";
            salesorderSearchObj.run().each(function (result) {
                emailBody += "Date: " + result.getValue({ name: 'trandate' }) + "<br/>";
                emailBody += "Document Number: " + result.getValue({ name: 'tranid' }) + "<br/>";
                emailBody += "Name: " + result.getText({ name: 'entity' }) + "<br/>";
                emailBody += "Memo: " + result.getValue({ name: 'memo' }) + "<br/>";
                emailBody += "Amount: " + result.getValue({ name: 'amount' }) + "<br/><br/><br/><br/><br/><br/>";
                return true;
            });

            // Send email
            var recipientEmail = 'gunaaspbtech@gmail.com';
            var subject = 'Lastmonth Details for sales orders details';
            email.send({
                author: -5,
                recipients: recipientEmail,
                subject: subject,
                body: emailBody
            });
        }

        return { execute };

    });