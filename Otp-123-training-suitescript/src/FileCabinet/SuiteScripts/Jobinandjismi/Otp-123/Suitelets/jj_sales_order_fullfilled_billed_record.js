/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/search', 'N/ui/serverWidget'],
    (search, serverWidget) => {
        function onRequest(context) {
            if (context.request.method === 'GET') {
                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Fulfilled and Billed Sales Orders'
                });

                // Add Subsidiary filter
                var subsidiaryField = form.addField({
                    id: 'custpage_subsidiary_filter',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Subsidiary',
                    source: 'subsidiary'
                });
                subsidiaryField.isMandatory = true;

                // Add Customer filter
                var customerField = form.addField({
                    id: 'custpage_customer_filter',
                    type: serverWidget.FieldType.SELECT,
                    label: 'Customer',
                    source: 'customer'
                });
                customerField.isMandatory = true;

                // Add a submit button
                form.addSubmitButton({
                    label: 'Search'
                });

                // Add a sublist to display sales orders initially
                var sublist = form.addSublist({
                    id: 'results_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'Sales Orders'
                });

                // Add fields to the sublist
                sublist.addField({
                    id: 'custpage_tranid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document Number'
                });

                sublist.addField({
                    id: 'custpage_customer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer'
                });

                sublist.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date'
                });

                sublist.addField({
                    id: 'custpage_total',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Total'
                });

                sublist.addField({
                    id: 'custpage_internal_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Internal ID'
                });

                sublist.addField({
                    id: 'custpage_status',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Status'
                });

                sublist.addField({
                    id: 'custpage_subtotal',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });

                // Search for all sales orders and populate the sublist
                var allSalesOrders = searchSalesOrders(null, null);
                for (var i = 0; i < allSalesOrders.length; i++) {
                    sublist.setSublistValue({
                        id: 'custpage_tranid',
                        line: i,
                        value: allSalesOrders[i].getValue({ name: 'tranid' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_customer',
                        line: i,
                        value: allSalesOrders[i].getText({ name: 'entity' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_date',
                        line: i,
                        value: allSalesOrders[i].getValue({ name: 'trandate' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_subtotal',
                        line: i,
                        value: allSalesOrders[i].getText({ name: 'subsidiary' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_total',
                        line: i,
                        value: allSalesOrders[i].getValue({ name: 'total' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_internal_id',
                        line: i,
                        value: allSalesOrders[i].getText({ name: 'internalid' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_status',
                        line: i,
                        value: allSalesOrders[i].getText({ name: 'status' })
                    });
                }

                // Display the form
                context.response.writePage(form);
            } else {
                // POST request handling
                var subsidiaryId = context.request.parameters.custpage_subsidiary_filter;
                var customerId = context.request.parameters.custpage_customer_filter;

                // Search for fulfilled and billed sales orders
                var searchResults = searchSalesOrders(subsidiaryId, customerId);

                // Create a new form
                var form = serverWidget.createForm({
                    title: 'Fulfilled and Billed Sales Orders'
                });

                // Add a sublist to display search results
                var sublist = form.addSublist({
                    id: 'results_sublist',
                    type: serverWidget.SublistType.LIST,
                    label: 'Sales Orders'
                });

                // Add fields to the sublist
                sublist.addField({
                    id: 'custpage_tranid',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Document Number'
                });
                sublist.addField({
                    id: 'custpage_internal_id',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Internal ID'
                });
                sublist.addField({
                    id: 'custpage_date',
                    type: serverWidget.FieldType.DATE,
                    label: 'Date'
                });

                sublist.addField({
                    id: 'custpage_status',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Status'
                });

                sublist.addField({
                    id: 'custpage_customer',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Customer'
                });

                sublist.addField({
                    id: 'custpage_subtotal',
                    type: serverWidget.FieldType.TEXT,
                    label: 'Subsidiary'
                });
                // sublist.addField({
                //     id: 'custpage_department',
                //     type: serverWidget.FieldType.TEXT,
                //     label: 'Department'
                // });
                // sublist.addField({
                //     id: 'custpage_class',
                //     type: serverWidget.FieldType.TEXT,
                //     label: 'Class'
                // });
                sublist.addField({
                    id: 'custpage_total',
                    type: serverWidget.FieldType.CURRENCY,
                    label: 'Total'
                });

                // Populate the sublist with search results
                for (var i = 0; i < searchResults.length; i++) {
                    sublist.setSublistValue({
                        id: 'custpage_tranid',
                        line: i,
                        value: searchResults[i].getValue({ name: 'tranid' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_customer',
                        line: i,
                        value: searchResults[i].getText({ name: 'entity' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_date',
                        line: i,
                        value: searchResults[i].getValue({ name: 'trandate' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_subtotal',
                        line: i,
                        value: searchResults[i].getText({ name: 'subsidiary' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_total',
                        line: i,
                        value: searchResults[i].getValue({ name: 'total' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_internal_id',
                        line: i,
                        value: searchResults[i].getText({ name: 'internalid' })
                    });

                    sublist.setSublistValue({
                        id: 'custpage_status',
                        line: i,
                        value: searchResults[i].getText({ name: 'status' })
                    });
                    // sublist.setSublistValue({
                    //     id: 'custpage_department',
                    //     line: i,
                    //     value: searchResults[i].getValue({ name: 'department' })
                    // });
                    // sublist.setSublistValue({
                    //     id: 'custpage_class',
                    //     line: i,
                    //     value: searchResults[i].getValue({ name: 'class' })
                    // });
                }

                // Display the form
                context.response.writePage(form);
            }
        }

        function searchSalesOrders(subsidiaryId, customerId) {
            var filters = [
                ['mainline', 'is', 'T'],
                'AND',
                ['type', 'anyof', 'SalesOrd'],
                'AND',
                ['status', 'anyof', 'SalesOrd:D', 'SalesOrd:G'] // Fulfilled or Billed status
            ];

            if (subsidiaryId) {
                filters.push('AND', ['subsidiary', 'anyof', subsidiaryId]);
            }

            if (customerId) {
                filters.push('AND', ['entity', 'anyof', customerId]);
            }

            var salesOrderSearch = search.create({
                type: search.Type.SALES_ORDER,
                filters: filters,
                columns: [
                    search.createColumn({ name: 'tranid', label: 'Document Number' }),
                    search.createColumn({ name: 'internalid', label: 'Internal ID' }),
                    search.createColumn({ name: 'entity', label: 'Customer' }),
                    search.createColumn({ name: 'trandate', label: 'Date' }),
                    search.createColumn({ name: 'total', label: 'Total' }),
                    search.createColumn({ name: 'status', label: 'Status' }),
                    search.createColumn({ name: 'subsidiary', label: 'Subsidary' }),
                    // search.createColumn({ name: 'department', label: 'Deaprtment' }),
                    // search.createColumn({ name: 'class', label: 'Class' })

                ]
            });

            return salesOrderSearch.run().getRange({ start: 0, end: 1000 });
        }

        return { onRequest };
    });
 
