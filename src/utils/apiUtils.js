import axios from "axios";


class ApiUtils {
    static getTeachings() {
        return axios.get('https://api.teachings.dwellcc.org/teachings?fields=TeachingID,Title,AuthorsFormatted,PassagesFormatted,Year,SeriesID,Topical,LanguageID&per-page=5000&expand=passages,authors',
            {responseEncoding: 'gzip', responseType: 'json', decompress: true});
    }

    static getTeachingById(id) {
        return axios.get(`https://api.teachings.dwellcc.org/teachings/${id}?expand=passages.biblebook,authors,series,keywords,media.mediatype,media.mediaHosts,media.language`);
    }

    static getImage(imgURl) {
        return axios.get(imgURl);
    }
    static getInitialFilters() {
        const getBibleBooks = axios.get('https://api.teachings.dwellcc.org/biblebooks?fields=BiblebookID,BookNameFull,Testament,TotalChapters&per-page=66');
        const getTeachers = axios.get('https://api.teachings.dwellcc.org/authors?fields=FullName,AuthorID');
        const getSeries = axios.get('https://api.teachings.dwellcc.org/series?fields=SeriesID,Title,TitleAbbr,Year&per-page=1000&expand=authors,biblebook');

        return axios
            .all([getBibleBooks, getTeachers, getSeries])
            .then(
                axios.spread((...responses) => {
                    return {
                        bibleBooks: responses[0].data,
                        teachers: responses[1].data,
                        series: responses[2].data.map(series => {
                            if (!series.TitleAbbr ) {
                                return {...series, TitleAbbr: `${series.biblebook?.BookNameFull} by ${series.authors[0]?.FullName} (${series.Year})`};
                            } else {
                                return series;
                            }
                        }).sort((a, b) => b.Year - a.Year),
                    };
                })
            );
    }

}
export default  ApiUtils;
