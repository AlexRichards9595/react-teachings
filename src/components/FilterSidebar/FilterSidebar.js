import React from 'react';
import PropTypes from 'prop-types';
import styles from './FilterSidebar.module.css';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import {
    Autocomplete,
    Checkbox,
    FormControl,
    FormControlLabel,
    TextField,
    FormGroup,
    ToggleButtonGroup,
    ToggleButton,
    Paper,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Button, Switch, useMediaQuery, useTheme,
} from "@mui/material";
import {useSearchParams} from "react-router-dom";

const FilterSidebar = (props) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const theme = useTheme();
    const filterElevation = useMediaQuery(theme.breakpoints.down('md')) ? 0 : 3;


    const handleBibleBookChange = (e, value) => {
        if (value) {
            props.onFilterChange({...props.selectedFilters, "bibleBook": value});
        } else {
            props.onFilterChange({...props.selectedFilters, "bibleBook": null, "chapter": null});
        }
    };

    const handleCheckboxEvent = (e) => {
        if (e.target.checked) {
            props.onFilterChange({
                ...props.selectedFilters,
                "teachers": [...props.selectedFilters.teachers, props.filters.teachers.find(teacher => teacher.AuthorID === parseInt(e.target.value))]
            });
        } else {
            props.onFilterChange({
                ...props.selectedFilters,
                "teachers": props.selectedFilters.teachers.filter(teacher => teacher.AuthorID !== parseInt(e.target.value))
            });
        }
    };

    return(
        <div className={styles.FilterSidebar} data-testid="FilterSidebar">
            <Paper elevation={filterElevation} sx={{padding: ".75rem"}}>
                <h2>Filter by:</h2>
                <FormControl component="fieldset" sx={{width: "100%"}}>
                    <FormGroup className={styles.EntireSidebar}>
                        <Autocomplete
                            id="bibleBook"
                            blurOnSelect
                            options={props.filters.bibleBooks}
                            getOptionLabel={(option) => option.BookNameFull}
                            groupBy={(option) => props.filters.bibleBooks.length > 1 ? option.Testament : ''}
                            isOptionEqualToValue={(option, value) => option.BiblebookID === value?.BiblebookID}
                            value={props.selectedFilters.bibleBook}
                            onChange={(e, value) => handleBibleBookChange(e, value)}
                            renderInput={(params) => <TextField
                                {...params}
                                key={params.id}
                                label="Bible Book"/>}
                        />
                        <Autocomplete
                            id="chapter"
                            blurOnSelect
                            disabled={!props.selectedFilters.bibleBook}
                            options={props.filters.chapters}
                            getOptionLabel={(option) => option.toString()}
                            value={props.selectedFilters.chapter}
                            onChange={(e, value) => {
                                props.onFilterChange({...props.selectedFilters, "chapter": value})}
                            }
                            renderInput={(params) => <TextField {...params} key={params.id} label="Chapter"/>}
                        />
                        <Autocomplete
                            id="series"
                            blurOnSelect
                            disabled={props.filters.series.length === 0}
                            options={props.filters.series}
                            getOptionLabel={(option) => option.TitleAbbr}
                            value={props.selectedFilters.series}
                            key={props.filters.series.SeriesID}
                            onChange={(e, value) => {
                                props.onFilterChange({...props.selectedFilters, "series": value})}
                            }
                            renderInput={(params) => <TextField {...params} key={params.id} label="Series"/>}
                        />
                        {props.filters.teachers.length > 0 && <h4>Teacher</h4>}
                        <div className={styles.TeacherCheckboxList}>
                            <FormGroup>
                                {props.filters.teachers.map((teacher) => {
                                    return <FormControlLabel
                                        sx={{width: '100%'}}
                                        control={<Checkbox color={"secondary"}
                                        onChange={(e) => handleCheckboxEvent(e)}/>}
                                        checked={props.selectedFilters.teachers.map(teacher => teacher.AuthorID).includes(teacher.AuthorID)}
                                        value={teacher.AuthorID}
                                        id={teacher.AuthorID}
                                        label={teacher.FullName}/>
                                })}
                            </FormGroup>
                        </div>
                        <Accordion elevation={0} defaultExpanded={searchParams.get("language") || searchParams.get("topical")}>
                            <AccordionSummary
                                sx={{padding: 0}}
                                expandIcon={<ExpandMoreIcon />}
                            >
                                <h4>More Filters</h4>
                            </AccordionSummary>
                            <AccordionDetails sx={{padding: 0}}>
                                <Autocomplete
                                    id="language"
                                    blurOnSelect
                                    options={props.filters.language}
                                    value={props.selectedFilters.language}
                                    onChange={(event, value) => {
                                        props.onFilterChange({...props.selectedFilters, "language": value})}
                                    }
                                    renderInput={(params) => <TextField {...params} key={params.id} label="Language"/>}
                                />
                                {props.toggleSwitch &&
                                    <FormControlLabel
                                        control={<Switch />}
                                        label="Topical Only"
                                        checked={props.selectedFilters.topical === 1}
                                        disabled={props.filters.topical.length === 0}
                                        onChange={(event, value) => {
                                            if (value) {
                                                props.onFilterChange({...props.selectedFilters, "topical": 1})
                                            } else {
                                                props.onFilterChange({...props.selectedFilters, "topical": null})
                                            }
                                        }}
                                    />
                                }
                            </AccordionDetails>
                        </Accordion>
                        <Button
                            color={"warning"}
                            onClick={() => {
                                props.onFilterChange({
                                    topical: 0,
                                    bibleBook: null,
                                    chapter: null,
                                    series: null,
                                    teachers: []
                                })}}
                        >Clear Filters</Button>
                    </FormGroup>
                </FormControl>
            </Paper>
        </div>
    )
};

FilterSidebar.propTypes = {};

FilterSidebar.defaultProps = {};

export default FilterSidebar;
