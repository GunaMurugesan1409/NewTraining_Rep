/**
 /**
 * @NApiVersion 2.1
 * @NScriptType MassUpdateScript
 */
define(['N/record', 'N/search'],
    /**
 * @param{record} record
 * @param{search} search
 */
    (record, search) => {
        /**
         * Defines the Mass Update trigger point.
         * @param {Object} params
         * @param {string} params.type - Record type of the record being processed
         * @param {number} params.id - ID of the record being processed
         * @since 2016.1
         */
        function each(params) {
           
            const recOpportunity = record.load({
                type: params.type,
                id: params.id
            });
            log.debug('recOpportunity', recOpportunity)
            recOpportunity.setValue(
                {
                    fieldId: 'custrecordjj_marital_status',
                    value: 1
                });
            recOpportunity.save();
        }
        return { each }

    });
