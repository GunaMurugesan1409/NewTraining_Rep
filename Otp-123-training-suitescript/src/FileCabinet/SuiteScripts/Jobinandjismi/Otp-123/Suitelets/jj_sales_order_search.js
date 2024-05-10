/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/record', 'N/search', 'N/ui/serverWidget'],
    /**
 * @param{record} record
 * @param{search} search
 * @param{serverWidget} serverWidget
 */
    (record, search, serverWidget) => {
        /**
         * Defines the Suitelet script trigger point.
         * @param {Object} scriptContext
         * @param {ServerRequest} scriptContext.request - Incoming request
         * @param {ServerResponse} scriptContext.response - Suitelet response
         * @since 2015.2
         */
        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Search for sales orders immediately
                var searchResults = searchSalesOrders('');

                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Sales Order Search Results'
                });

                // Add a sublist to display search results
                var sublist = form.addSublist({
                    id: 'results_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'Search Results'
                });

                // Add fields to the sublist
                sublist.addField({
                    id: 'doc_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document Number'
                });

                sublist.addField({
                    id: 'customer_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                });

                sublist.addField({
                    id: 'subsidiary',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });

                sublist.addField({
                    id: 'order_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Order Date'
                });

                // Populate the sublist with search results
                for (var i = 0; i < searchResults.length; i++) {
                    sublist.setSublistValue({
                        id: 'doc_number',
                        line: i,
                        value: searchResults[i].getValue({ name: 'tranid' })
                    });

                    sublist.setSublistValue({
                        id: 'customer_name',
                        line: i,
                        value: searchResults[i].getText({ name: 'entity' })
                    });

                    sublist.setSublistValue({
                        id: 'subsidiary',
                        line: i,
                        value: searchResults[i].getText({ name: 'subsidiary' })
                    });

                    sublist.setSublistValue({
                        id: 'order_date',
                        line: i,
                        value: searchResults[i].getValue({ name: 'trandate' })
                    });
                }

                // Display the form
                context.response.writePage(form);
            } else if (context.request.method === 'POST') {
                // Retrieve search text from the form
                var searchText = context.request.parameters.search_text;

                // Search for sales orders based on the search text
                var searchResults = searchSalesOrders(searchText);

                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Sales Order Search Results'
                });

                // Add a sublist to display search results
                var sublist = form.addSublist({
                    id: 'results_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'Search Results'
                });

                // Add fields to the sublist
                sublist.addField({
                    id: 'doc_number',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document Number'
                });

                sublist.addField({
                    id: 'customer_name',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer Name'
                });

                sublist.addField({
                    id: 'subsidiary',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });

                sublist.addField({
                    id: 'order_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Order Date'
                });

                // Populate the sublist with search results
                for (var i = 0; i < searchResults.length; i++) {
                    sublist.setSublistValue({
                        id: 'doc_number',
                        line: i,
                        value: searchResults[i].getValue({ name: 'tranid' })
                    });

                    sublist.setSublistValue({
                        id: 'customer_name',
                        line: i,
                        value: searchResults[i].getText({ name: 'entity' })
                    });

                    sublist.setSublistValue({
                        id: 'subsidiary',
                        line: i,
                        value: searchResults[i].getText({ name: 'subsidiary' })
                    });

                    sublist.setSublistValue({
                        id: 'order_date',
                        line: i,
                        value: searchResults[i].getValue({ name: 'trandate' })
                    });
                }

                // Display the form
                context.response.writePage(form);
            }
        }
        function searchSalesOrders(searchText) {
            var salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters:
                    [
                        ["mainline", "is", "T"],
                        "AND",
                        ["type", "anyof", "SalesOrd"]

                        // ["internalid", "anyof", "1065", "1064"]
                    ],

                columns:
                    [
                        search.createColumn({ name: "trandate", label: "Date" }),
                        search.createColumn({ name: "type", label: "Type" }),
                        search.createColumn({ name: "tranid", label: "Document Number" }),
                        search.createColumn({ name: "entity", label: "Name" }),
                        search.createColumn({ name: "amount", label: "Amount" }),
                        search.createColumn({ name: "subsidiary", label: "Subsidiary" })
                    ]
            });

            return salesOrderSearch.run().getRange({
                start: 0,
                end: 100 // Adjust as needed based on expected results
            });
        }

        return { onRequest }
    });
