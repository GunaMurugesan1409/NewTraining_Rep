/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/record', 'N/search', 'N/file', "N/email"],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search, file, email) => {
        function getInputData(context) {
            var salesInformationSearch = search.create({
                type: "salesorder",
                filters:
                    [
                        ["type", "anyof", "SalesOrd"],
                        "AND",
                        ["mainline", "is", "T"],
                        "AND",
                        ["trandate", "within", "lastmonth"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "email", label: "Email" }),
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "amount", label: "Amount" })
                    ]
            });
            return salesInformationSearch;
        }
        const map = (mapContext) => {
            let searchResult = JSON.parse(mapContext.value);
            let customerName = searchResult.values['entity'].value;
            let salesOrderDetails = {
                'customername': searchResult.values['entity'].text,
                'email': searchResult.values['email'],
                'documentnumber': searchResult.values['tranid'],
                'amount': searchResult.values['amount']
            };
            mapContext.write({
                key: customerName,
                value: JSON.stringify(salesOrderDetails)
            });
        }

        const reduce = (context) => {
            var customerId = context.key;
            var salesDetails = context.values;
            const custRecord = record.load({
                type: record.Type.CUSTOMER,
                id: customerId
            });
            var salesRep = custRecord.getValue({
                fieldId: 'salesrep'
            });
            log.debug("salesRep", salesRep);

            var csvContent = 'Customer Name,Email,Document,Amount\n';
            var emailBody = "Open Invoice Details for the customer:<br/><br/>";
            invoiceSearchObj.run().each(function (result) {
                emailBody += "Customer Name: " + result.getValue({ name: 'entity' }) + "<br/>";
                emailBody += " Invoice Document Number: " + result.getValue({ name: 'tranid' }) + "<br/>";

                return true;
            });
            salesDetails.forEach((sale) => {
                const fetchData = JSON.parse(sale);
                // log.debug("fetchData", fetchData);
                var customerName = fetchData.customername;
                var customerEmail = fetchData.email;
                var custDocument = fetchData.documentnumber;
                var custAmount = fetchData.amount;

                csvContent += customerName + ',' + customerEmail + ',' + custDocument + ',' + custAmount + '\n';
            });
            var csvFile = file.create({
                name: 'last_month_' + customerId + '.csv',
                contents: csvContent,
                fileType: file.Type.CSV,
                folder: 17
            });
            var csvFileId = csvFile.save();
            log.debug("csvFileId", csvFileId);
            if (salesRep) {
                //log.debug("If is Working");
                email.send({
                    author: -5,
                    recipients: salesRep,
                    subject: "Sale Order Details ",
                    body: "Please Check the Sales Order Details in below Attachment",
                    attachments: [csvFile],
                });
            }
            else {
               // log.debug("Else is working");
                email.send({
                    author: -5,
                    recipients: "will@gmail.com",
                    subject: "Add Sales Rep",
                    body: "Plesase Add Sales Rep for the Customer " + customerId,
                    attachments: [csvFile],
                });
            }

        }

        const summarize = (summaryContext) => {


        }

        return { getInputData, map, reduce, summarize }

    });