/**
 * @NApiVersion 2.1
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
/**********************************************************************************************************************************************************************************
 *
 * AUTHOR: Jobin and Jismi
 *
 * ${OTP-7227}: ${Restrict IF Save}
 *
 * Date Created: 14-May-2024
 *
 * Created By: Guna Murugesan
 *
 * Description: This script is to restrict saving itemfulfillment record based on condition
 *
 ********************************************************************************************************************************************************************************
 */
define(['N/record', 'N/search', 'N/ui/dialog'],
    function (record, search, dialog) {
        function saveRecord(scriptContext) {
            try {
                var recIf = scriptContext.currentRecord;
                var order = recIf.getValue({
                    fieldId: 'createdfrom'
                });
                log.debug('Sales Order', order);
                var orderRec = record.load({
                    type: record.Type.SALES_ORDER,
                    id: order,
                    isDynamic: true
                });
                var tot = orderRec.getValue({
                    fieldId: 'total'
                });
                log.debug('Sales Order Total', tot);
                var mySearch = search.create({
                    type: search.Type.CUSTOMER_DEPOSIT,
                    filters: [['salesorder', 'anyof', order], 'AND', ["mainline", "is", "T"]],
                    columns: ['amount']
                });
                var depositTotal = 0;
                mySearch.run().each(function (result) {
                    var amt = result.getValue({
                        name: 'amount'
                    });
                    log.debug('Deposit Amount', amt);
                    depositTotal += parseFloat(amt);
                    return true;
                });

                if (depositTotal === 0) {
                    return true; 
                } else if (depositTotal >= tot) {
                    return true; 
                } else {
                    dialog.alert({
                        title: 'Error',
                        message: 'Record cannot be saved; customer deposit amount should be greater than or equal to sales order total.'
                    });
                    return false; 
                }
            } catch (e) {
                console.error(e);
            }
        }
        return {
            saveRecord: saveRecord
        };
    });


