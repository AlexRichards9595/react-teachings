import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './TeachingsSearchPage.module.css';
import FilterSidebar from "../../components/FilterSidebar/FilterSidebar";
import TeachingResultsTable from "../../components/TeachingResultsTable/TeachingResultsTable";
import FilterUtils from "../../utils/filterUtils";
import ApiUtils from "../../utils/apiUtils";
import {useSearchParams} from "react-router-dom";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    CircularProgress,
    FormControlLabel,
    Switch,
    useMediaQuery, useTheme
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import teachingHeader from "../../resources/teaching-search-header.png";

const TeachingsSearchPage = (props) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [teachingsAreLoading, setTeachingsAreLoading] = useState(true);
    const [searchParamsHaveSetSelectedFilters, setSearchParamsHaveSetSelectedFilters] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [teachings, setTeachings] = useState([]);
    const [filteredTeachings, setFilteredTeachings] = useState([]);
    const [allFilters, setAllFilters] = useState({topical:[1], bibleBooks: [], teachers:[], series:[], language:[{label: "English", value: 1}, {label: "Spanish", value: 2}]});
    const [availableFilters, setAvailableFilters] = useState({topical: [1], bibleBooks: [], chapters: [], teachers:[], series:[], language: [{label: "English", value: 1}, {label: "Spanish", value: 2}]});
    const [selectedFilters, setSelectedFilters] = useState({
        topical: null,
        bibleBook: null,
        chapter: null,
        series: null,
        teachers: [],
        language: null
    });
    const filterUtils = new FilterUtils();

    useEffect(() => {
        ApiUtils.getTeachings().then((response) => {
            setTeachings(response.data);
            setFilteredTeachings(response.data);
            setTeachingsAreLoading(false);
        });

        ApiUtils.getInitialFilters().then((response) => {
            console.log(response.series);
            setAllFilters({...response, topical: [1], language: [{label: "English", value: 1}, {label: "Spanish", value: 2}]});
            setAvailableFilters({...response, chapters: [], topical: [1], language: [{label: "English", value: 1}, {label: "Spanish", value: 2}]});
            setSelectedFilters((prevState) => ({
                ...prevState,
                topical: parseInt(searchParams.get("topical")),
                bibleBook: response.bibleBooks.find(bibleBook => bibleBook.BiblebookID === parseInt(searchParams.get("bibleBook"))),
                chapter: searchParams.get("chapter"),
                series: response.series.find(series => series.SeriesID === parseInt(searchParams.get("series"))),
                teachers: response.teachers.filter(teacher => searchParams.getAll("teacher").map(idString => parseInt(idString)).includes(teacher.AuthorID)),
                language: allFilters.language.find(language => language.value === parseInt(searchParams.get("language"))),
           }));
            setSearchParamsHaveSetSelectedFilters(true);

        });
    }, [searchParams]);

    useEffect(() => {
        const [filteredTeachings, filteredTeachingsNotIncludingAuthor, filteredTeachingsNotIncludingTopical] = filterUtils.filterTeachings(selectedFilters, teachings);
        setFilteredTeachings(filteredTeachings);
        setAvailableFilters(filterUtils.getAvailableFiltersFromTeachings(
            selectedFilters,
            allFilters,
            filteredTeachings,
            filteredTeachingsNotIncludingAuthor,
            filteredTeachingsNotIncludingTopical
        ));

        if(searchParamsHaveSetSelectedFilters) {
            setSearchParams({
                ...searchParams,
                ...(selectedFilters.topical) && {"topical": 1},
                ...(selectedFilters.bibleBook) && {"bibleBook": selectedFilters.bibleBook.BiblebookID},
                ...(selectedFilters.chapter) && {"chapter": selectedFilters.chapter},
                ...(selectedFilters.series) && {"series": selectedFilters.series.SeriesID},
                ...(selectedFilters.teachers.length > 0) && {"teacher": selectedFilters.teachers.map(teacher => teacher.AuthorID)},
                ...(selectedFilters.language) && {"language": selectedFilters.language.value},
            });
        }
    }, [allFilters, searchParamsHaveSetSelectedFilters, searchParams, selectedFilters, setSearchParams, teachings]);


   return (
           <div className={teachingsAreLoading ? styles.Loading : styles.TeachingsSearchPage} data-testid="TeachingsSearchPage">
               <img className={styles.HeaderImage} src={teachingHeader}   alt={"Header"}/>
               {teachingsAreLoading &&
                   <div className={styles.ProgressContainer}>
                       <CircularProgress color={"secondary"} />
                   </div>
               }
               {!teachingsAreLoading &&
                   <div className={styles.TeachingSearchBody}>
                       {isMobile &&
                           <Accordion elevation={3} sx={{marginTop: '1rem'}}>
                               <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                   <h4>Filter Results</h4>
                               </AccordionSummary>
                               <AccordionDetails sx={{padding: 0}}>
                                   <FilterSidebar
                                       onFilterChange={setSelectedFilters}
                                       selectedFilters={selectedFilters}
                                       filters={availableFilters}
                                   />
                               </AccordionDetails>
                        </Accordion>
                       }{ !isMobile &&
                           <FilterSidebar
                               onFilterChange={setSelectedFilters}
                               selectedFilters={selectedFilters}
                               filters={availableFilters}
                           />
                       }
                        <div className={styles.Results}>
                            <TeachingResultsTable
                                onFilterChange={setSelectedFilters}
                                selectedFilters={selectedFilters}
                                teachings={filteredTeachings}
                            />
                        </div>
                   </div>
               }
        </div>
       );
}


TeachingsSearchPage.propTypes = {};

TeachingsSearchPage.defaultProps = {};

export default TeachingsSearchPage;
