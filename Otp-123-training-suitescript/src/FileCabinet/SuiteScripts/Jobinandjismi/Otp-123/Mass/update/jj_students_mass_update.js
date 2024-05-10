/**
 * @NApiVersion 2.x
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/log'],
    function (record, log) {
        function each(params) {
            var studentRecord = record.load({
                type: 'customrecord_students_details_1_10',
                id: params.id,
                isDynamic: true
            });

            var oldClass = studentRecord.getValue({ fieldId: 'custrecord_class' });
            var newClass;

            if (oldClass === "10") {
                newClass = "Completed";
            } else if (oldClass !== "Completed") {
                newClass = parseInt(oldClass) + 1;
                newClass = newClass.toString();
            }

            try {
                studentRecord.setValue({
                    fieldId: 'custrecord_class',
                    value: newClass
                });
                studentRecord.save({
                    enableSourcing: false,
                    ignoreMandatoryFields: true
                });
                log.debug('Record Updated', 'ID: ' + params.id + ' New Class: ' + newClass);
            } catch (e) {
                log.error('Update Error', e.toString());
            }
        }

        return {
            each: each
        };
    });
