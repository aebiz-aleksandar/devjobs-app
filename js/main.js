    //Variables:

    //DOM Select
    const switchInput = document.getElementById('switch-input');

    //DOM Select from index.html
    const sectionJobs = document.querySelector('.section-jobs');
    const jobsHolder = document.querySelector('.jobs-holder');
    const iconFilter = document.querySelector('.icon-filter');
    const additionalSearchField = document.querySelector('.search-item-two');
    const smallSearchBtn = document.querySelector('.btn-search-small');
    const largeSearchBtn = document.querySelector('.btn-search-large');
    const titleInput = document.getElementById('title-input');
    const locationInput = document.getElementById('location-input');
    const moreLessBtn = document.getElementById('btn-more-less');
    const jobPeriodCheck = document.querySelector('.job-period-check');

    //DOM Select from job-page.html
    const jobDetailsInfoHolder = document.querySelector('.job-details-info-holder');
    const sectionDetailsHolder = document.querySelector('.section-details-holder');
    const jobDetailsFooter = document.querySelector('.job-details-footer .container');

    //Global Select
    let currentDataArr = [];
    let allDataArr = [];
    let fullTime = false;

    //Function: Get Data
    const getData = () => {
        return fetch('data.json')
        .then(response => response.json())
        .catch(err => console.log(err));
    };

    //Function: Fill Job List
    const fillJobList = (jobs, jobsNum) => {
        //first empty jobs holder and current data arr
        jobsHolder.innerHTML = '';
        console.log(jobs);
        //---------------------------------------
        if (jobs.length > 0) {
            //remove class error if there is
            if (sectionJobs.classList.contains('error')) {
                sectionJobs.classList.remove('error');
            }
            
            jobs.forEach((job, index) => {
                if (index < jobsNum) {
                    //create div with class 'col'
                    const colDiv = document.createElement('div');
                    colDiv.classList.add('col');
                    //fill div with another element
                    colDiv.innerHTML = `<article class="job-article">
                        <div class="job-image" style="background: ${ job.logoBackground }">
                            <img src=${ job.logo } alt="${ job.company }-logo">
                        </div>
                        <div class="job-content">
                            <div class="job-info">
                                ${ timePosted(job.postedAt) }
                                <span>.</span>
                                ${ job.contract }
                            </div>
                            <h3 class="job-title">
                                <a href="job-page.html?job=${ job.id }">${ job.position }</a>
                            </h3>
                            <span class="job-position">${ job.company }</span>
                            <span class="job-location">${ job.location }</span>
                        </div>
                    </article>`;
                    //add element col div to parent element jobs holder
                    jobsHolder.appendChild(colDiv);
                }
            });
        } else {
            sectionJobs.classList.add('error');
            showMessage('Sorry, no jobs match your search');
        }
    };

    //Function: Fill Job Detail
    const fillJobDetail = (jobId, jobs) => {
        const jobDetail = jobs.find(job => job.id === jobId);
        //job requirements
        const jobRequirements = jobDetail.requirements.items.map(item => {
            return `<li>${ item }</li>`;
        });
        //job role
        const jobRole = jobDetail.role.items.map(item => {
            return `<li>${ item }</li>`;
        });
        //first empty section detial holder
        sectionDetailsHolder.innerHTML = '';
        //create details caption for job and add class for him
        const jobCaption = document.createElement('div');
        jobCaption.classList.add('section-job-details-caption');
        //create details holder for job and add class for him
        const jobHolder = document.createElement('div');
        jobHolder.classList.add('section-job-details-holder');
        
        //inner content in job detail info holder
        jobDetailsInfoHolder.innerHTML = `<div class="job-logo" style="background: ${ jobDetail.logoBackground }"><img src="${ jobDetail.logo }" alt="${ jobDetail.position }-logo"></div>
        <div class="job-title">
            <div>
                <h3>${ jobDetail.company }</h3>
                <span>${ jobDetail.website }</span>
            </div>
            <a href="${ jobDetail.website }" target="_blank" class="btn btn-cta">Company Site</a>
        </div>`;
        //inner content in job caption
        jobCaption.innerHTML = `<div class="job-basic-info">
            <div class="job-info">
                ${ timePosted(jobDetail.postedAt) }
                <span>.</span>
                ${ jobDetail.contract }
            </div>
            <h3 class="job-title">${ jobDetail.position }</h3>
            <span class="job-location">${ jobDetail.location }</span>
        </div>
        <a href="${ jobDetail.apply }" target="_blank" class="btn job-apply-btn">Apply Now</a>`;

        //inner content in job holder
        jobHolder.innerHTML = `<p class="main-job-description">${ jobDetail.description }</p>
        <div class="job-requirements">
            <h3 class="requirement-title">Requirements</h3>
            <p class="requirement-content">${ jobDetail.requirements.content }</p>
            <ul class="requirement-items">
                ${ jobRequirements.join('') }
            </ul>
        </div>
        <div class="job-role">
            <h3 class="role-title">What you will do</h3>
            <p class="role-content">${ jobDetail.role.content }</p>
            <ol class="role-items">
                ${ jobRole.join('') }
            </ol>
        </div>`;

        //append job caption & job holder to section detail holder
        sectionDetailsHolder.appendChild(jobCaption);
        sectionDetailsHolder.appendChild(jobHolder);

        //inner content in job details footer
        jobDetailsFooter.innerHTML = `<div class="footer-job-info">
            <h3>${ jobDetail.position }</h3>
            <span>${ jobDetail.company }</span>
        </div>
        <a href="${ jobDetail.apply }" target="_blank" class="btn btn-job-apply">Apply Now</a>`;
    };

    //Function: Show Message
    const showMessage = message => {
        const div = document.createElement('div');
        const span = document.createElement('span');
        div.classList.add('message-holder', 'container');
        span.appendChild(document.createTextNode(message));
        div.appendChild(span);

        const main = document.querySelector('.main-main');
        const sectionJobs = document.querySelector('.section-jobs');
        main.insertBefore(div, sectionJobs);

        //remove this message after 3sec
        setTimeout(() => main.removeChild(div), 3000);
    };

    //Function: Filter Jobs
    const filterJobs = e => {

        //remove serach item two holder if resolution less than 768px
        if (window.innerWidth <= 768 && e.currentTarget.classList.contains('btn-search-large')) {
            closeAdditionalSearch();
        }

        const titleInputValue = titleInput.value;
        const locationInputValue = locationInput.value;
        let filterArr = [];
        
        if (titleInputValue === '' && locationInputValue === '') {
            showMessage('Can\'t be both input field empty');
            return;
        }

        //both title and location input
        if (titleInputValue && locationInputValue) {
            const expTitle = new RegExp(titleInputValue, 'gi');
            const expLocation = new RegExp(locationInputValue, 'gi');
            filterArr = currentDataArr.filter(job => {
                if (job.position.match(expTitle) && job.location.match(expLocation)) {
                    return job;
                }
            });
        } else {
            //only title input
            if (titleInputValue) {
                const expTitle = new RegExp(titleInputValue, 'gi');
                filterArr = currentDataArr.filter(job => {
                    if (job.position.match(expTitle)) {
                        return job;
                    }
                });
            //only location input
            } else if (locationInputValue) {
                const expLocation = new RegExp(locationInputValue, 'gi');
                filterArr = currentDataArr.filter(job => {
                    if (job.location.match(expLocation)) {
                        return job;
                    }
                });
            }
        }
        //empty input value for title and location
        titleInput.value = '';
        locationInput.value = '';
        moreLessBtn.textContent = 'Show More'
        //fillter based on job with full time
        if (fullTime) {
            filterArr = filterArr.filter(job => job.contract === 'Full Time');
        }
        //fill jobs list after filter job
        fillJobList(filterArr, filterArr.length);
    };

    //Function: Chagne Theme
    const chagneTheme = () => {
        const isSwitch = switchInput.checked;
        if (isSwitch) {
            document.querySelector('html').className = 'dark';
        } else {
            document.querySelector('html').className = 'light';
        }
    };

    //Function: Open Additional Search
    const openAdditionalSearch = () => {
        if (additionalSearchField.classList.contains('hide')) {
            additionalSearchField.classList.remove('hide');
        }
    };

    //Function: Close Additional Search
    const closeAdditionalSearch = () => {
        additionalSearchField.classList.add('hide');
    };

    //Function: Show More Less Jobs
    const showMoreLessJobs = e => {
        const element = e.target;
        if (element.textContent === 'Show More') {
            element.textContent = 'Show Less';
            currentDataArr = allDataArr;
            fillJobList(allDataArr, allDataArr.length);
        } else if (element.textContent === 'Show Less') {
            element.textContent = 'Show More';
            currentDataArr = [];
            allDataArr.forEach((job, index) => {
                if (index < Math.floor(allDataArr.length / 2)) {
                    currentDataArr.push(job);
                }
            });
            fillJobList(currentDataArr, currentDataArr.length);
        }
    };

    //Function: Set Job Period
    const setJobPeriod = e => {
        if (e.currentTarget.classList.contains('check-true')) {
            e.currentTarget.classList.remove('check-true');
            fullTime = false;
        } else {
            e.currentTarget.classList.add('check-true');
            fullTime = true;
        }
    };

    //Function: Time Posted
    const timePosted = (time) => {
        let postedAt = null;
        const today = new Date().getTime();
        const postedDay = new Date(time).getTime();

        const targetDay = today - postedDay;

        const oneMonth = 1000 * 60 * 60 * 24 * 30; // milisec in one month
        const oneWeek = 1000 * 60 * 60 * 24 * 7; // milisec in one week
        const oneDay = 1000 * 60 * 60 * 24; // milisec in one day
        const oneHour = 1000 * 60 * 60; // milisec in one hour

        const month = Math.floor(targetDay / oneMonth);
        const week = Math.floor(targetDay / oneWeek);
        const day = Math.floor(targetDay / oneDay);
        const hour = Math.floor(targetDay / oneHour);

        if (month > 0) {
            postedAt = `${ month }mo ago`;
        } else if (week > 0) {
            postedAt = `${ week }w ago`;
        } else if(day > 0) {
            postedAt = `${ day }d ago`;
        } else if (hour >= 0) {
            postedAt = `${ hour }h ago`;
        }

        return postedAt;
    };

    //Event: Document Loaded
    document.addEventListener('DOMContentLoaded', () => {
        if (location.pathname === '/') {
            //get data and fill job list
            getData().then(data => {
                allDataArr = data;
                const displayJobNum = Math.floor(allDataArr.length / 2);
                fillJobList(allDataArr, displayJobNum);
                //current data arr fill with certain num job
                allDataArr.forEach((job, index) => {
                    if (index < displayJobNum) {
                        currentDataArr.push(job);
                    }
                });
            });

            //Event: open additional search field on mobile screen
            iconFilter.addEventListener('click', openAdditionalSearch);

            //Event: close additional search field on mobile screen
            window.addEventListener('click', e => {
                if (!additionalSearchField.classList.contains('hide')) {
                    if (e.target.classList.contains('search-item-two')) {
                        closeAdditionalSearch();
                    }
                }
            });

            //Event: filter jobs
            smallSearchBtn.addEventListener('click', filterJobs);
            largeSearchBtn.addEventListener('click', filterJobs);

            //Event: Show More or Less jobs
            moreLessBtn.addEventListener('click', showMoreLessJobs);

            //Event: Set Job Period
            jobPeriodCheck.addEventListener('click', setJobPeriod);
        } else if (location.pathname === '/job-page.html') {
            const pageUrl = location.href.split('?')[1];
            const jobId = pageUrl.slice(pageUrl.indexOf('=') + 1);
            //get data and fill job details
            getData().then(data => {
                fillJobDetail(jobId, data);
            });
        }
    });

    //Event: Change Theme
    switchInput.addEventListener('change', chagneTheme);
