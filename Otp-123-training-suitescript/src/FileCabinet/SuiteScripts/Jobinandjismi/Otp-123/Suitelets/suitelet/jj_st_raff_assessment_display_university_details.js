/**
 * @NApiVersion 2.1
 * @NScriptType Suitelet
 */
define(['N/ui/serverWidget', 'N/http'], function (serverWidget, http) {

    function onRequest(context) {
        var request = context.request;
        var response = context.response;
        if (request.method === 'GET') {
            var form = serverWidget.createForm({
                title: 'University List Details'
            });

            var countryField = form.addField({
                id: 'custpage_jj_country',
                type: serverWidget.FieldType.SELECT,
                label: 'Country'
            });
            log.debug('countryField', countryField)
            countryField.addSelectOption({
                value: '',
                text: ''
            });
            countryField.addSelectOption({
                value: 'India',
                text: 'India'
            });
            countryField.addSelectOption({
                value: 'China',
                text: 'China'
            });
            countryField.addSelectOption({
                value: 'Japan',
                text: 'Japan'
            });
            countryField.isMandatory = true;

            form.addSubmitButton({
                label: 'Submit'
            });

            // The sublist should be defined here but not populated yet
            var sublist = form.addSublist({
                id: 'custpage_jj_university_sublist',
                type: serverWidget.SublistType.LIST,
                label: 'University Details'
            });
            sublist.addField({
                id: 'custpage_jj_country',
                type: serverWidget.FieldType.TEXT,
                label: 'Country'
            });
            sublist.addField({
                id: 'custpage_jj_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            });
            sublist.addField({
                id: 'custpage_jj_state',
                type: serverWidget.FieldType.TEXT,
                label: 'State/Province'
            });
            sublist.addField({
                id: 'custpage_jj_webpage',
                type: serverWidget.FieldType.URL,
                label: 'Web Pages'
            });

            response.writePage(form);
        } else {
            var country = request.parameters.custpage_jj_country;
            var url = 'http://universities.hipolabs.com/search?country=' + (country);
            var httpResponse = http.get({
                url: url
            });
            log.debug('url', url)
            var universities = JSON.parse(httpResponse.body);
            log.debug('universities', universities)
            var form = serverWidget.createForm({
                title: 'University List'
            });

            // create the country field and set the selected value
            var countryField = form.addField({
                id: 'custpage_jj_country',
                type: serverWidget.FieldType.SELECT,
                label: 'Country'
            });
            countryField.addSelectOption({ value: 'India', text: 'India', isSelected: country === 'India' });
            countryField.addSelectOption({ value: 'China', text: 'China', isSelected: country === 'China' });
            countryField.addSelectOption({ value: 'Japan', text: 'Japan', isSelected: country === 'Japan' });
            countryField.isMandatory = true;

            form.addSubmitButton({
                label: 'Submit'
            });

            // Re-create the sublist
            var sublist = form.addSublist({
                id: 'custpage_jj_university_sublist',
                type: serverWidget.SublistType.LIST,
                label: 'University Details'
            });
            sublist.addField({
                id: 'custpage_jj_country',
                type: serverWidget.FieldType.TEXT,
                label: 'Country'
            });
            sublist.addField({
                id: 'custpage_jj_name',
                type: serverWidget.FieldType.TEXT,
                label: 'Name'
            });
            sublist.addField({
                id: 'custpage_jj_state',
                type: serverWidget.FieldType.TEXT,
                label: 'State/Province'
            });
            sublist.addField({
                id: 'custpage_jj_webpage',
                type: serverWidget.FieldType.URL,
                label: 'Web Pages'
            });
            
            // Populate country with the sublist with the search results
            universities.forEach(function (university, index) {
                log.debug({
                    title: 'Setting sublist values',
                    details: 'Line: ' + index + ', Country: ' + university.country + ', Name: ' + university.name + ', State/Province: ' + university['state-province'] + ', Web Page: ' + university.web_pages[0]
                });
                sublist.setSublistValue({
                    id: 'custpage_jj_country',
                    line: index,
                    value: university.country 
                });
                sublist.setSublistValue({
                    id: 'custpage_jj_name',
                    line: index,
                    value: university.name 
                });
                sublist.setSublistValue({
                    id: 'custpage_jj_state',
                    line: index,
                    value: university['state-province']
                });

                sublist.setSublistValue({
                    id: 'custpage_jj_webpage',
                    line: index,
                    value: (university.web_pages && university.web_pages[0]) 
                });
            });


            response.writePage(form);
        }
    }
    return {
        onRequest: onRequest
    };
});
