/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 * @NModuleScope SameAccount
 */
define(['N/email', 'N/record', 'N/runtime', 'N/ui/dialog'],
    /**
     * @param{email} email
     * @param{record} record
     * @param{runtime} runtime
     * @param{dialog} dialog
     */
    function (email, record, runtime, dialog) {
        function sendEmailToVendor(oldQuantity, updatedQuantity, itemName, documentNumber, vendorId) {
            var subject = 'The quantity updated in the PO: ' + documentNumber;
            var body = 'Item Name: ' + itemName + '<br>';
            body += 'Old Quantity: ' + oldQuantity + '<br>';
            body += 'Updated Quantity: ' + updatedQuantity + '<br>';

            var vendorEmail = getVendorEmail(vendorId);
            console.log('Vendor Email:', vendorEmail);

            if (vendorEmail) {
                email.send({
                    author: -5,
                    recipients: vendorEmail,
                    subject: subject,
                    body: body,
                });
            } else {
                console.log('Vendor email not found for vendor ID:', vendorId);
            }
        }

        function getVendorEmail(vendorId) {
            // Fetch vendor record
            var vendor = record.load({
                type: record.Type.VENDOR,
                id: vendorId,
                isDynamic: true
            });

            // Get vendor's email
            var vendorEmail = vendor.getValue({
                fieldId: 'email'
            });
            console.log('Retrieved Vendor Email:', vendorEmail);

            return vendorEmail;
        }

        function fieldChanged(context) {
            var currentRecord = context.currentRecord;

            if (context.fieldId === 'quantity') {
                var oldQuantity = currentRecord.getSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: context.line
                });
                console.log('Old Quantity:', oldQuantity);

                var updatedQuantity = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity'
                });
                console.log('Updated Quantity:', updatedQuantity);

                var itemName = currentRecord.getCurrentSublistValue({
                    sublistId: 'item',
                    fieldId: 'item'
                });
                console.log('Item Name:', itemName);

                var documentNumber = currentRecord.getValue({
                    fieldId: 'tranid'
                });
                console.log('Document Number:', documentNumber);

                var vendorId = currentRecord.getValue({
                    fieldId: 'entity' // Assuming 'entity' field holds the vendor ID
                });
                console.log('Vendor ID:', vendorId);

                sendEmailToVendor(oldQuantity, updatedQuantity, itemName, documentNumber, vendorId);
            }
        }

        return {
            fieldChanged: fieldChanged
        };
    });

