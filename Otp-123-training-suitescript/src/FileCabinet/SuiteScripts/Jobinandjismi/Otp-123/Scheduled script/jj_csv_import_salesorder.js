/**
 * @NApiVersion 2.1
 * @NScriptType ScheduledScript
 */
define(['N/email', 'N/file', 'N/log', 'N/search', 'N/runtime', 'N/format'],
    (email, file, log, search, runtime, format) => {
 
        /**
         * Defines the Scheduled script trigger point.
         * @param {Object} scriptContext
         * @param {string} scriptContext.type - Script execution context. Use values from the scriptContext.InvocationType enum.
         * @since 2015.2
         */
        const execute = (scriptContext) => {
            try {
                // Function to format date to MM/DD/YYYY
                function format(date) {
                    return format.format({
                        value: date,
                        type: format.Type.DATE
                    });
                }
 
                // Create the customer search object
                var customerSearchObj = search.create({
                    type: "customer",
                    filters: [
                        ["datecreated", "within", "thismonthtodate"]
                    ],
                    columns: [
                        search.createColumn({ name: "entityid", label: "Name" }),
                        search.createColumn({ name: "datecreated", label: "Date Created" }),
                        search.createColumn({ name: "terms", label: "Terms" }),
                        search.createColumn({ name: "salesrep", label: "Sales Rep" })
                    ]
                });
 
                // Initialize CSV content
                var csvContent = 'Name,Date Created,Terms,Sales Rep\n';
 
                // Iterate over search results and append data to CSV content
                customerSearchObj.run().each(function (result) {
                    var name = result.getValue({ name: "entityid" });
                    var dateCreated = result.getValue({ name: "datecreated" });
                    var terms = result.getText({ name: "terms" });
                    var salesRep = result.getText({ name: "salesrep" });
 
                    // Append data to CSV content
                    csvContent += name + ',' + dateCreated + ',' + terms + ',' + salesRep +'\n';
 
                    return true;
                });
 
                // Create the CSV file
                var csvFile = file.create({
                    name: 'customers_report.csv',
                    contents: csvContent,
                    folder: 17,
                    fileType: 'CSV'
                });
                var subject = 'Monthly Customers Report';
                var body = 'Dear Customer,\n\nAttached is your monthly report.\n\nBest regards';
                var customerEmail = "gunaaspbtech@gmail.com"
                // Send email
                email.send({
                    author: -5,
                    recipients: 'gunaaspbtech@gmail.com',
                    subject: 'Monthly Customers Report',
                    body: 'Dear Customer,\n\nAttached is your monthly report.\n\nBest regards,',
                    attachments: [csvFile]
                });
                // Save the file
                var csvFileId = csvFile.save();
                log.debug('CSV File Created with ID', csvFileId);
            } catch (error) {
                log.error("Error", error);
            }
        }
 
        return { execute }
 
    });   