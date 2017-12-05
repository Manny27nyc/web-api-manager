(function () {
    "use strict";

    const standardsDefaults = window.WEB_API_MANAGER.defaults;
    const standardsDefinitions = window.WEB_API_MANAGER.standards;
    const categoriesLib = window.WEB_API_MANAGER.categoriesLib;
    const Vue = window.Vue;

    const standardSort = (standardIdA, standardIdB) => {
        const standardA = standardsDefinitions[standardIdA];
        const standardB = standardsDefinitions[standardIdB];
        return standardA.info.name.localeCompare(standardB.info.name);
    };

    Vue.component("web-api-standards", {
        props: ["standards", "selectedStandards", "selectedDomain"],
        render: window.WEB_API_MANAGER.vueComponents["web-api-standards"].render,
        staticRenderFns: window.WEB_API_MANAGER.vueComponents["web-api-standards"].staticRenderFns,
        computed: {
            categoryStrings: function () {
                return categoriesLib.categories;
            },
            categories: function () {
                const categoryKeys = Object.keys(standardsDefinitions)
                    .reduce((collection, stdId) => {
                        const standard = standardsDefinitions[stdId];
                        const stdCategory = standard.info.category;
                        collection[stdCategory] = true;

                        return collection;
                    }, {});

                return Object.keys(categoryKeys).sort();
            },
            standardsByCategory: function () {

                const categoriesToStandards = Object.keys(standardsDefinitions)
                    .sort(standardSort)
                    .reduce((collection, stdId) => {
                        const standard = standardsDefinitions[stdId];
                        const stdCategory = standard.info.category;
                        if (collection[stdCategory] === undefined) {
                            collection[stdCategory] = [];
                        }
                        collection[stdCategory].push(standard);

                        return collection;
                    }, {});

                return categoriesToStandards;
            }
        },
        methods: {
            onStandardChecked: function () {
                this.$root.$data.setSelectedStandards(this.selectedStandards);
            },
            onLiteClicked: function () {
                this.$root.$data.setSelectedStandards(standardsDefaults.lite);
            },
            onConservativeClicked: function () {
                this.$root.$data.setSelectedStandards(standardsDefaults.conservative);
            },
            onAggressiveClicked: function () {
                this.$root.$data.setSelectedStandards(standardsDefaults.aggressive);
            },
            onClearClicked: function () {
                this.$root.$data.setSelectedStandards([]);
            },
            onAllClicked: function () {
                const allStandards = Object.keys(this.standards)
                    .map(aStdName => this.standards[aStdName].info.identifier);
                this.$root.$data.setSelectedStandards(allStandards);
            }
        }
    });
}());