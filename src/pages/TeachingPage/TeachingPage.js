import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import styles from './TeachingPage.module.css';
import { useParams } from 'react-router-dom';
import ApiUtils from "../../utils/apiUtils";
import {Button, CircularProgress, Dialog, DialogContent, DialogTitle} from "@mui/material";
import moment from "moment";
import facebookLogo from '../../resources/facebook_logo.png';
import emailLogo from '../../resources/email_logo.png';
import twitterLogo from '../../resources/twitter_logo.png';
import downloadIcon from '../../resources/download_icon.png';
import shareIcon from '../../resources/share_icon.png';

const TeachingPage = () => {
    const { id } = useParams();
    const [teaching, setTeaching] = useState(null);
    const [teachingDate, setTeachingDate] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [teacherImage, setTeacherImage] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);


    useEffect(() => {
        ApiUtils.getTeachingById(id).then((response) => {
            if (response.data.series.Title === null ) {
                response.data.series.Title = `${response.data.passages[0].biblebook.BookNameFull} by ${response.data.AuthorsFormatted}`;
            }
            setTeaching(response.data);
            setTeachingDate(moment(response.data.TeachingDateTime));
            setIsLoading(false);
            document.title = response.data.Title;
            console.log(response.data);
            // ApiUtils.getImage(response.data.authors[0]?.PhotoUrl).then(response => {
            //     setTeacherImage(response.data);
            // });
        });
    }, []);

    return (
        <div className={styles.TeachingPage} data-testid="TeachingPage">
            {isLoading && <CircularProgress />}
            {!isLoading &&
                <React.Fragment>
                    <div className={styles.Title}>
                        <a href={`https://teachings.dwellcc.org/series/${teaching.series.SeriesID}`}><h3 className={styles.SeriesTitle}>{teaching.series.Title}</h3></a>
                        <h1>{teaching.Title}</h1>
                        <img src={teacherImage} alt={"Teacher Image"}/>
                        <h4>{teaching.AuthorsFormatted}</h4>
                        <p>{teaching.PassagesFormatted}</p>
                    </div>
                    <div className={styles.LinksBar}>
                        <p>Download Materials</p>
                        <p>Keywords</p>
                    </div>
                    <div className={styles.Details}>
                        <div className={styles.DetailsHeader}>
                            <p>Teaching Date: {teachingDate.format('MM/DD/YYYY')}</p>
                            <p className={styles.ShareButton} onClick={() => setDialogOpen(!dialogOpen)}>
                                Share
                                <img className={styles.Icon} src={shareIcon} alt={"share"}/>
                            </p>
                            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                                <DialogTitle>Share Teaching</DialogTitle>
                                <DialogContent className={styles.DialogContent}>
                                    <a href={`https://www.facebook.com/sharer.php?u=https%3A%2F%2Fteachings.dwellcc.org%2Fteaching%2F${id}`} target="_blank" rel={"noreferrer"}>
                                        <img className={styles.Social} src={facebookLogo} alt={'facebook'} />
                                    </a>
                                    <a href={`https://twitter.com/share?url=https%3A%2F%2Fteachings.dwellcc.org%2Fteaching%2F${id}`} target="_blank" rel={"noreferrer"}>
                                        <img className={styles.Social} src={twitterLogo} alt={'twitter'} />
                                    </a>
                                    <a href={`mailto:?subject=Dwell Bible Teaching&body=https%3A%2F%2Fteachings.dwell.org%2Fteaching%2F${id}`} target="_blank" rel={"noreferrer"}>
                                        <img className={styles.Social} src={emailLogo} alt={'email'} />
                                    </a>
                                </DialogContent>
                            </Dialog>
                        </div>
                        {teaching.Summary && <div>
                            <h2>Summary</h2>
                            <p className={styles.SummaryBody}>
                                {teaching.Summary}
                            </p>
                        </div>}
                        {(teaching.media.map(x => x.MediatypeID).includes(2) && !teaching.media.map(x => x.MediatypeID).includes(4)) && <div>
                            <audio controls style={{width: '100%'}}>
                                <source src={teaching.media.find(x => x.MediatypeID === 2).Url} type={"audio/mpeg"}/>
                            </audio>
                        </div>}
                        {teaching.media.map(x => x.MediatypeID).includes(4) &&
                            <div className={styles.Video} dangerouslySetInnerHTML={{__html: teaching.media.find(x => x.MediatypeID === 4).mediaHosts[0].HostEmbedHtml}} />
                        }
                        <div>
                            <h2>Download Materials</h2>
                            <div className={styles.DownloadableContent}>
                                {teaching.media.filter(x => x.MediatypeID === 3 || x.MediatypeID === 5).map(x => {
                                    return <a href={`${x.Url}?disposition=download`} download>{x.mediatype.Label}
                                        <img className={styles.Icon} src={downloadIcon} alt={"download"}/>
                                    </a>
                                })}
                            </div>
                        </div>
                        <div className={styles.KeywordContainer}>
                            <h2>Keywords</h2>
                            <div className={styles.KeywordList}>
                                {teaching.keywords.map((keyword, index) => {
                                    return <React.Fragment>
                                        <span key={index} className={styles[`span${index}`]}>&#8226;</span>
                                        <p key={keyword.KeywordID}>{keyword.Label}</p>
                                    </React.Fragment>
                                })}
                            </div>
                        </div>
                    </div>
                </React.Fragment>
            }
        </div>
    );
};

TeachingPage.propTypes = {};

TeachingPage.defaultProps = {};

export default TeachingPage;
