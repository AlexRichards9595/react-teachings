import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './TeachingResultsTable.module.css';
import {
    TableCell,
    TableHead,
    TableRow,
    TableBody,
    TableContainer,
    Paper,
    Table,
    TablePagination, FormControl, InputLabel, Select, MenuItem, Grid, useMediaQuery, useTheme, Pagination
} from "@mui/material";
import closeIcon from "../../resources/cancel__icon.png";
import * as _ from 'underscore';
import {Link} from "react-router-dom";

const sortOptions = [
    {display: 'Title (A-Z)', sortTeachings: (teachings) => _.sortBy(teachings, 'Title')},
    {display: 'Title (Z-A)', sortTeachings: (teachings) => _.sortBy(teachings, 'Title').reverse()},
    {display: 'Teacher (A-Z)', sortTeachings: (teachings) => _.sortBy(teachings, 'AuthorsFormatted')},
    {display: 'Teacher (Z-A)', sortTeachings: (teachings) => _.sortBy(teachings, 'AuthorsFormatted').reverse()},
    {display: 'Year (Newest)', sortTeachings: (teachings) => _.sortBy(teachings, 'Year').reverse()},
    {display: 'Year (Oldest)', sortTeachings: (teachings) => _.sortBy(teachings, 'Year')},
];

const TeachingResultsTable = (props) => {
    const theme = useTheme();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [pills, setPills] = useState([]);
    const [selectedSort, setSelectedSort] = useState(sortOptions[4]);
    const [teachingsTable, setTeachingsTable] = useState(props.teachings);



    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    useEffect(() => {
        setTeachingsTable(selectedSort.sortTeachings(props.teachings))
    }, []);

    useEffect(() => {
        selectedSort ?
            setTeachingsTable(selectedSort.sortTeachings(props.teachings))
            : setTeachingsTable(props.teachings);
    }, [props.teachings, selectedSort]);

    useEffect( () => {
        let newPillState = [];
        if (props.selectedFilters.topical) {
            newPillState = [
                ...newPillState,
                {
                    display: "Topical", removeFunction: () => {props.onFilterChange({...props.selectedFilters, "topical": null});
                }}
            ];
        }
        if (props.selectedFilters.bibleBook) {
            newPillState = [
                ...newPillState,
                {
                    display: `Book: ${props.selectedFilters.bibleBook.BookNameFull}`,
                    removeFunction: () => {props.onFilterChange({...props.selectedFilters, "bibleBook": null, "chapter": null});
                }}
            ];
        }
        if (props.selectedFilters.chapter) {
            newPillState = [
                ...newPillState,
                {
                    display: `Chapter: ${props.selectedFilters.chapter}`,
                    removeFunction: () => {props.onFilterChange({...props.selectedFilters, "chapter": null});
                }}
            ];
        }
        if (props.selectedFilters.series) {
            newPillState = [
                ...newPillState,
                {
                    display: `Series: ${props.selectedFilters.series.TitleAbbr}`,
                    removeFunction: () => {props.onFilterChange({...props.selectedFilters, "series": null});
                }}
            ];
        }
        if (props.selectedFilters.teachers.length > 0) {
            newPillState = [
                ...newPillState,
                props.selectedFilters.teachers.map(teacher => ({
                    display: `Teacher: ${teacher.FullName}`,
                    removeFunction: () => {props.onFilterChange({
                        ...props.selectedFilters,
                        "teachers": props.selectedFilters.teachers.filter(filterTeacher => filterTeacher.AuthorID !== teacher.AuthorID)
                    });}
                }))
            ].flat();
        }
        if (props.selectedFilters.language) {
            newPillState = [
                ...newPillState,
                {
                    display: `Language: ${props.selectedFilters.language.label}`,
                    removeFunction: () => {props.onFilterChange({...props.selectedFilters, "language": null});
                    }}
            ];
        }

        setPills(newPillState);
        setPage(0);
    }, [props.selectedFilters]);

    return (
        <div className={styles.TeachingResultsTable} data-testid="TeachingResultsTable">
            <Paper elevation={3} className={styles.TableContainer}>
                <h1>Bible Teachings</h1>
                <div className={styles.PillsAndSort}>
                    <div className={styles.PillRow}>
                        {pills.length > 0 ? <h3>Showing: </h3> : <h3>Showing: All Resources</h3>}
                        {pills.map(pill =>
                            <div className={styles.Pill}>
                                <img className={styles.RemoveButton} src={closeIcon} alt={"close"} onClick={pill.removeFunction}/>
                                {pill.display}
                            </div>)}
                    </div>
                    <FormControl className={styles.SortSelect}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                            id="sort-select"
                            label={"Sort By"}
                            onChange={((e) => setSelectedSort(sortOptions[e.target.value]))}
                            defaultValue={4}
                        >
                            {sortOptions.map((sortOption, index) => {
                                return <MenuItem value={index}>{sortOption.display}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </div>
                <Grid container spacing={{xs: 1, md: 2}}  columns={{xs: 1}}>
                    {useMediaQuery(theme.breakpoints.up('md')) &&
                        <Grid item xs={1} key={'header'}>
                            <div className={styles.TeachingGridHeader}>
                                <p style={{width: '30%'}}>TITLE</p>
                                <p style={{width: '20%'}}>TEACHER</p>
                                <p style={{width: '40%'}}>PASSAGE(S)</p>
                                <p style={{width: '10%'}}>YEAR</p>
                            </div>
                        </Grid>
                    }
                    {teachingsTable
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((teaching) => (
                            <Grid item xs={1} key={teaching.TeachingID}>
                                <Link className={styles.TeachingRow} to={`/teaching/${teaching.TeachingID}`}>
                                    <h3 className={styles.TitleCell}>{teaching.Title}</h3>
                                    <p className={styles.TeacherCell}>{teaching.AuthorsFormatted}</p>
                                    <p className={styles.PassageCell}>{teaching.PassagesFormatted}</p>
                                    <p className={styles.YearCell}>{teaching.Year}</p>
                                </Link>
                            </Grid>
                    ))}
                </Grid>
                <TablePagination
                    sx={{maxWidth: "100%", overflow: "hidden"}}
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={props.teachings.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
                {useMediaQuery(theme.breakpoints.down('md')) &&
                    <Pagination
                        sx={{margin: "auto"}}
                        count={props.teachings.length / rowsPerPage}
                        page={page}
                        onChange={handleChangePage}
                        variant={"outlined"}
                        color={"secondary"}
                        size={"small"}
                    />
                }
            </Paper>
        </div>
    );
}

TeachingResultsTable.propTypes = {};

TeachingResultsTable.defaultProps = {};

export default TeachingResultsTable;
