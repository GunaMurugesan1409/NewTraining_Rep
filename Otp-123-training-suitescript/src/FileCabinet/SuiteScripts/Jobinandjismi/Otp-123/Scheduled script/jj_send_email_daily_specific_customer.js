/**
 * @NApiVersion 2.x
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/record', 'N/search'],

    function (email, record, search) {

        function execute(context) {
            // Define search filters
            var customerSearchObj = search.create({
                type: "customer",
                filters:
                    [
                        ["subsidiary", "anyof", "1"],
                        "AND",
                        ["companyname", "startswith", "ABC"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "entityid", label: "Name" }),
                        search.createColumn({ name: "email", label: "Email" }),
                        search.createColumn({ name: "phone", label: "Phone" }),
                        search.createColumn({ name: "altphone", label: "Office Phone" }),
                        search.createColumn({ name: "fax", label: "Fax" }),
                        search.createColumn({ name: "contact", label: "Primary Contact" }),
                        search.createColumn({ name: "altemail", label: "Alt. Email" })
                    ]
            });
            var searchResultCount = customerSearchObj.runPaged().count;
            log.debug("customerSearchObj result count", searchResultCount);
            customerSearchObj.run().each(function (result) {
                // .run().each has a limit of 4,000 results
                return true;
            });

            // Prepare and send email to each customer
       
                // Prepare email content
                var subject = 'Daily Update';
                var body = 'Dear Customer, \n\n This is your daily update.';
                var customerEmail = "gunaaspbtech@gmail.com"
                // Send email
                email.send({
                    author: -5, 
                    recipients: customerEmail,
                    subject: subject,
                    body: body,
                });
        }

        return {
            execute: execute
        };
    });
