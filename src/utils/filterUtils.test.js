import FilterUtils from "./filterUtils";

describe("Filter Utilities", () => {
    let filterUtils;
    const emptyFilters = {
        topical: null,
        bibleBook: null,
        chapter: null,
        series: null,
        teachers: [],
        language: null
    };
    beforeEach(() => {
        filterUtils = new FilterUtils();
    });

    describe("filterTeachings", () => {
        test('should not filter anything if the filter is not selected', () => {
            const filterByBook = jest.spyOn(filterUtils, 'filterTeachingsByBook');
            const filterByChapter = jest.spyOn(filterUtils, 'filterTeachingsByChapter');
            const filterBySeries = jest.spyOn(filterUtils, 'filterTeachingsBySeries');
            const filterByLanguage = jest.spyOn(filterUtils, 'filterTeachingsByLanguage');
            const filterByTeachers = jest.spyOn(filterUtils, 'filterTeachingsByTeachers');
            const filterByTopical = jest.spyOn(filterUtils, 'filterTeachingsByTopical');

            filterUtils.filterTeachings(emptyFilters, []);

            expect(filterByBook).not.toHaveBeenCalled();
            expect(filterByChapter).not.toHaveBeenCalled();
            expect(filterBySeries).not.toHaveBeenCalled();
            expect(filterByLanguage).not.toHaveBeenCalled();
            expect(filterByTeachers).not.toHaveBeenCalled();
            expect(filterByTopical).not.toHaveBeenCalled();
        });

        test('should filter by book if there is a selected book filter', () => {
            const filterByBook = jest.spyOn(filterUtils, 'filterTeachingsByBook');
            const filterWithBibleBookSelected = {...emptyFilters, bibleBook: 'John'};

            filterUtils.filterTeachings(filterWithBibleBookSelected, []);

            expect(filterByBook).toHaveBeenCalled();
        });
    });
});
