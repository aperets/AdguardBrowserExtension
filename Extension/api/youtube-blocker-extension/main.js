/* eslint-disable no-console */

// Init the configuration
const configuration = {
    // English filter alone
    filters: [2],

    // disabled on www.test.com
    whitelist: ['www.test.com'],

    // Array of custom rules
    rules: ['example.org##h1'],

    // Filters metadata file path
    filtersMetadataUrl: 'https://filters.adtidy.org/extension/chromium/filters.json',

    // Filter file mask
    filterRulesUrl: 'https://filters.adtidy.org/extension/chromium/filters/{filter_id}.txt',
};

// Add event listener for blocked requests
const onBlocked = function (details) {
    console.log(details);
};

adguardApi.onRequestBlocked.addListener(onBlocked);

// Add event listener for rules created by Assistant
chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'assistant-create-rule') {
        console.log(`Rule ${message.ruleText} was created by Assistant`);
        configuration.rules.push(message.ruleText);
        adguardApi.configure(configuration, () => {
            console.log('Finished API re-configuration');
        });
    }
});

adguardApi.start(configuration, () => {
    console.log('Finished API initialization.');

    // Now we want to disable on www.google.com
    configuration.whitelist.push('www.google.com');
    adguardApi.configure(configuration, () => {
        console.log('Finished API re-configuration');
    });
});
