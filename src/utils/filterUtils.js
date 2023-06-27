
class FilterUtils {
    filterTeachings(filters, teachings) {
        if (filters.bibleBook) {
            teachings = this.filterTeachingsByBook(teachings, filters);
        }

        if(filters.chapter) {
            teachings = this.filterTeachingsByChapter(teachings, filters);
        }
        if (filters.series) {
            teachings = this.filterTeachingsBySeries(teachings, filters);
        }

        if (filters.language) {
            teachings = this.filterTeachingsByLanguage(teachings, filters);
        }

        let teachingNotFilteredByTeachers = [...teachings];
        if (filters.teachers.length > 0) {
            teachings = this.filterTeachingsByTeachers(teachings, filters);
        }

        const teachingsNotFilteredByTopical = [...teachings];
        if (filters.topical) {
            teachings = this.filterTeachingsByTopical(teachings, filters);
            teachingNotFilteredByTeachers = this.filterTeachingsByTopical(teachingNotFilteredByTeachers, filters);
        }

        return [teachings, teachingNotFilteredByTeachers, teachingsNotFilteredByTopical];
    }

     filterTeachingsByTopical(teachings, filters) {
        return teachings.filter(teaching => teaching.Topical === filters.topical);
    }

     filterTeachingsByTeachers(teachings, filters) {
        return teachings
            .filter(teaching => filters.teachers
                .some(teacher => teaching.authors.map(author => author.AuthorID).includes(teacher.AuthorID)));
    }

     filterTeachingsByLanguage(teachings, filters) {
        return teachings
            .filter(teaching => teaching.LanguageID === filters.language.value);
    }

     filterTeachingsBySeries(teachings, filters) {
        return teachings
            .filter(teaching => teaching.SeriesID === filters.series.SeriesID);
    }

     filterTeachingsByChapter(teachings, filters) {
        return teachings
            .filter(teaching => teaching.passages
                .some(passage => (passage.ChapterBegin <= filters.chapter && passage.ChapterEnd >= filters.chapter)));
    }

     filterTeachingsByBook(teachings, filters) {
        return teachings.filter(teaching => teaching.passages
            .some(passage => (passage.BiblebookID === filters.bibleBook.BiblebookID)));
    }

     getAvailableFiltersFromTeachings(selectedFilters, allFilters, teachings, teachingsWithoutTeachers, teachingsWithoutTopical) {
        let availableFilters = {...allFilters};
        availableFilters.topical = this.setAvailableTopicalFilterOptions(allFilters, teachingsWithoutTopical);
        availableFilters.bibleBooks = this.setAvailableBibleBookFilterOptions(selectedFilters, allFilters, teachings);
        availableFilters.chapters = this.setAvailableChapterFilterOptions(selectedFilters, allFilters, teachings);
        availableFilters.series = this.setAvailableSeriesFilterOptions(allFilters, teachings);
        availableFilters.teachers = this.setAvailableTeacherFilterOptions(allFilters, teachingsWithoutTeachers);
        availableFilters.language = this.setAvailableLanguageFilterOptions(allFilters, teachings);

        return availableFilters;
    }

     setAvailableTopicalFilterOptions(allFilters, teachings) {
        return allFilters.topical.filter(topical => teachings
            .map(teaching => teaching.Topical).includes(topical));
    }

     setAvailableBibleBookFilterOptions(selectedFilters, allFilters, teachings) {
        if (!selectedFilters.bibleBook) {
            return allFilters.bibleBooks
                .filter(bibleBook => teachings
                    .map(teaching => teaching.passages.map(passage => passage.BiblebookID)).flat().includes(bibleBook.BiblebookID));
        }
        return [allFilters.bibleBooks.find(bibleBook => bibleBook.BiblebookID === selectedFilters.bibleBook.BiblebookID)];
    }

     setAvailableChapterFilterOptions(selectedFilters, allFilters, teachings) {
        if(selectedFilters.bibleBook && !selectedFilters.chapter) {
            const selectedBibleBook = (allFilters.bibleBooks
                .find(bibleBook => bibleBook.BiblebookID === selectedFilters.bibleBook.BiblebookID));
            const chaptersArray = [...Array(selectedBibleBook.TotalChapters).keys()].map(i => i + 1);
            const arrayOfChapterBeginAndEnd = teachings
                .map(teaching => teaching.passages.map(({ChapterBegin, ChapterEnd, BiblebookID}) => ({
                    ChapterBegin,
                    ChapterEnd,
                    BiblebookID
                }))).flat();
            return chaptersArray.filter(chapter => {
                return arrayOfChapterBeginAndEnd.some(teaching => {
                    return (teaching.ChapterBegin <= chapter &&
                        teaching.ChapterEnd >= chapter &&
                        teaching.BiblebookID === selectedBibleBook.BiblebookID);
                });
            });
        }
        return [selectedFilters.chapter];
    }

     setAvailableTeacherFilterOptions(allFilters, teachings) {
        return allFilters.teachers
            .filter(teacher => teachings
                .map(teaching => teaching.authors.map(author => author.AuthorID)).flat().includes(teacher.AuthorID));
    }

     setAvailableSeriesFilterOptions(allFilters, teachings) {
         return allFilters.series
             .filter(x => [...new Set(teachings.map(teaching => teaching.SeriesID))].includes(x.SeriesID));
    }

     setAvailableLanguageFilterOptions(allFilters, teachings) {
        return allFilters.language
            .filter(x => [...new Set(teachings.map(teaching => teaching.LanguageID))].includes(x.value));
    }
}

export default  FilterUtils;
