/*****************************************************************************************************************************************************************************************
**************************
*
*${RAFF Assesment}:${Create a page to display the details of universities using data from hipolabs.com.}
*
******************************************************************************************************************************************************************************************
**************************
 *
 * Author : Jobin and Jismi
 *
 * Date Created : 10-May-2024
 *
 * Created by :Guna M , Jobin and Jismi IT Services.
 *
 * Description : Create a Restlet endpoint for creating customer statements in the file cabinet.
 *
 *
*****************************************************************************************************************************************************************************************
******************************/
/**
 * @NApiVersion 2.x
 * @NScriptType Restlet
 */
define(['N/file', 'N/record', 'N/email', 'N/search', 'N/runtime'],
    function (file, record, email, search, runtime) {

        function post(data) {
            try {
                var requestBody = JSON.parse(data);
                var folderName = requestBody['folder name'];
                log.debug('folderName', folderName);
                var emailAddress = requestBody['email address'];
                log.debug('emailAddress', emailAddress);
                var startDate = new Date(requestBody['startDate']);

                // Validate request body
                if (!folderName || !emailAddress || !startDate) {
                    return { error: 'All fields in the request body must have a value.' };
                }

                // Check for duplicate folder names
                var existingFolders = searchFolder(folderName);
                if (existingFolders && existingFolders.length > 0) {
                    return { error: 'Folder name already exists.' };
                }

                // Create new folder
                var folderId = createFolder(folderName);
                log.debug('folderId', folderId);

                // Get all customers
                var customers = getAllCustomers();
                log.debug('customers', customers);

                // Generate and store customer statements
                generateCustomerStatements(customers, startDate, folderId);
                log.debug('generateCustomerStatements', generateCustomerStatements)


                // Send email notification
                sendEmailNotification(emailAddress, folderName);

                return { success: 'Customer statements created successfully.' };
            } catch (e) {
                log.error('Error', e);
                log.error('Error message', e.message);
                log.error('Stack trace', e.stack);
                return { error: 'Error processing request. Please check the server logs for more details.' };
            }
        }

        function searchFolder(folderName) {
            var folderSearch = search.create({
                type: "folder",
                filters:
                    [
                        ["file.name", "contains", "csv"],
                        "AND",
                        ["internalid", "anyof", "-100", "-20", "-19", "-18", "-17", "-16", "-15", "-14", "-13", "-12", "-11", "-10", "-9", "-8", "-7", "-6", "-5", "-4", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "118", "119", "120", "121", "122", "123", "124", "125", "126", "127", "128", "129", "130", "131", "132", "133", "134", "135", "136", "137", "138", "139", "140", "141", "142", "143", "144", "145", "146", "147", "148", "149", "150", "151", "152", "153", "154", "220", "221", "222", "223", "224", "225", "226", "227", "228", "229", "230", "231", "232", "233", "234", "235", "236", "237", "238", "239", "240", "241", "242", "243", "244", "245", "246", "247", "248", "249", "250", "251", "252", "253", "254", "320", "420", "421", "520", "620", "621", "622", "623", "624", "625", "721", "722", "723", "724", "725", "726", "727", "728", "729", "730", "731", "732", "733", "734"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "name", label: "Name" }),
                        search.createColumn({ name: "foldersize", label: "Size (KB)" }),
                        search.createColumn({ name: "lastmodifieddate", label: "Last Modified" }),
                        search.createColumn({ name: "parent", label: "Sub of" }),
                        search.createColumn({ name: "numfiles", label: "# of Files" })
                    ]
            });
            return folderSearch.run().getRange({ start: 0, end: 1 });
        }

        function createFolder(folderName) {
            var folder = file.create({
                name: folderName,
                fileType: file.Type.FOLDER
            });
            return folder.save();
        }

        function getAllCustomers() {
            var customerSearch = search.create({
                type: search.Type.CUSTOMER,
                filters:
                    [
                        ["internalid", "anyof", "315", "314", "313", "312", "310", "308", "307", "305", "304", "303", "302", "301", "300", "299", "201", "198", "197", "-8", "-7", "-5", "-4", "-3", "-2", "194", "195", "94", "88", "79", "78", "77", "76", "75", "74", "72", "71", "70", "60", "58", "56", "55", "54", "53", "52", "51", "50", "49", "48", "47", "46", "45", "44", "43", "42", "41", "40", "39", "38", "37", "36", "35", "33", "32", "31", "30", "29", "28", "27", "26", "25", "24", "23", "16", "3"],
                        "AND",
                        ["startdate", "within", "lastmonth"]
                    ],
                columns:
                    [
                        search.createColumn({ name: "entityid", label: "Name" }),
                        search.createColumn({ name: "email", label: "Email" }),
                        search.createColumn({ name: "phone", label: "Phone" }),
                       
                    ]
            }).run().getRange({ start: 0, end: 1000 }); // Limiting to 1000 customers

            return customerSearch;
        }

        function generateCustomerStatements(customers, startDate, folderId) {
            customers.forEach(function (customer) {
                var customerId = customer.getValue({ name: 'internalid' });
                var statement = ''; // Generate statement PDF
                var fileName = customerId + '_' + new Date().getTime() + '.pdf'; // Unique filename with PDF extension

                file.create({
                    name: fileName,
                    fileType: file.Type.PDF,
                    contents: statement,
                    folder: folderId
                }).save();
            });
        }

        function sendEmailNotification(emailAddress, folderName) {
            //var adminEmail = runtime.getCurrentUser().email;
            var subject = 'Customer Statements Created';
            var body = 'Customer statements have been generated and stored in folder "' + folderName + '".';

            email.send({
                author: -5, 
                recipients: emailAddress,
                subject: subject,
                body: body
            });
        }

        return {
            post: post
        };

    });


    