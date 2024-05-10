/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */

define(['N/email', 'N/record'], function (email, record) {

    function sendEmailToVendor(oldQuantity, updatedQuantity, itemName, documentNumber, vendorId) {
        var subject = 'The quantity updated in the PO: ' + documentNumber;
        var body = 'Item Name: ' + itemName + '<br>';
        body += 'Old Quantity: ' + oldQuantity + '<br>';
        body += 'Updated Quantity: ' + updatedQuantity + '<br>';

        var vendorEmail = getVendorEmail(vendorId);

        if (vendorEmail) {
            email.send({
                author: -5, 
                recipients: vendorEmail, 
                subject: subject,
                body: body,
            });
        } else {
            console.log('Vendor email not found.');
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

            var updatedQuantity = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'quantity'
            });

            var itemName = currentRecord.getCurrentSublistValue({
                sublistId: 'item',
                fieldId: 'item'
            });

            var documentNumber = currentRecord.getValue({
                fieldId: 'tranid'
            });

            var vendorId = currentRecord.getValue({
                fieldId: 'entity' // Assuming 'entity' field holds the vendor ID
            });

            sendEmailToVendor(oldQuantity, updatedQuantity, itemName, documentNumber, vendorId);
        }
    }

    return {
        fieldChanged: fieldChanged
    };
});
