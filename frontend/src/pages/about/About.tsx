import React, {useEffect, useState} from 'react';
import axios, {AxiosInstance} from 'axios';
import {withRouter} from 'react-router'
import {Media} from 'react-bootstrap';
import NavigationHeader from '../shared/NavigationHeader';
import uuidv4 from 'uuid/v4'

import * as GitLab from './GitLabInterface'
//people
import larry from './images/people/Larry.jpeg'
import doug from './images/people/doug.jpeg'
import edmond from './images/people/edmond.jpeg'
import lloyd from './images/people/lloyd.jpeg'
import ian from './images/people/ian.jpg'
//tools
import aws from './images/tools/aws.jpg'
import slack from './images/tools/slack.jpg'
import discord from './images/tools/discord.png'
import docker from './images/tools/docker.png'
import react from './images/tools/react.png'
import bootstrap from './images/tools/bootstrap.jpg'
import postman from './images/tools/postman.png'
import gitlab from './images/tools/gitlab.png'
//sources
import google from './images/sources/google.jpg'
import zillow from './images/sources/zillow.gif'

const aliases: Map<string, string> = new Map<string, string>([
    ['ian_mcdonald@rocketmail.com', 'Ian'],
    ['me@misterti.me', 'Edmond'],
    ['gurgitatorsupreme@gmail.com', 'Edmond'],
    ['ilm353', 'Ian'],
    ['lukaoma@utexas.edu', 'Larry'],
    ['Lukaoma@utexas.edu', 'Larry'],
    ['lloydg@utexas.edu', 'Lloyd'],
    ['lloydgumireddy@Lloyds-MacBook-Pro.local', 'Lloyd'],
    ['lloydgumireddy@wireless-10-147-203-94.public.utexas.edu', 'Lloyd'],
    ['lloydgumireddy@wireless-10-145-82-22.public.utexas.edu', 'Lloyd'],
    ['d.archibald@gmail.com', 'Doug'],
    ['d.archibald84@gmail.com', 'Doug'],
]);

const usernameAliases: Map<string, string> = new Map<string, string>([
    ['ian_mcd', 'Ian'],
    ['eogagnon', 'Edmond'],
    ['lukaoma', 'Larry'],
    ['lloydg', 'Lloyd'],
    ['abhinavk99', 'Doug'],
    ['dharchibald', 'Doug']
]);

const contributors: Map<string, GitLab.Contributor> = new Map<string, GitLab.Contributor>([
    ['Larry', {
        name: 'Larry',
        img: larry,
        bio: 'Hello I\'m a UT CS TA and work for XBOX',
        responsibilities: 'Team Leader',
    }],
    ['Ian', {
        name: 'Ian',
        img: ian,
        bio: 'Hi I\'m Ian, I\'m an engineering officer for UT\'s electronic game developers society.  In my free timespan I like to boulder at Greg gym.  ',
        responsibilities: 'Back-End Engineer',
    }],
    ['Lloyd', {
        name: 'Lloyd',
        img: lloyd,
        bio: 'Hi I\'m Lloyd and I\'m a senior. Outside class, I enjoy hiking and eating.',
        responsibilities: 'Front-End Engineer',
    }],
    ['Doug', {
        name: 'Doug',
        img: doug,
        bio: 'Hey I\'m Douglas. In my spare timespan, I like to listen to music.',
        responsibilities: 'Back-End Engineer',
    }],
    ['Edmond', {
        name: 'Edmond',
        img: edmond,
        bio: 'The man, the myth, the disappointment. Sometimes you can hear the Chuck E. Cheese tokens rattling about in my head.',
        responsibilities: 'Dev-Ops Engineer',
    }]
]);


const tools: Map<string, GitLab.ToolOrSource> = new Map<string, GitLab.ToolOrSource>([
    ['AWS', {
        name: 'AWS',
        img: aws,
        description: 'We hosted our Website using Amplify. Our backend is hosted on Elastic Bean and the database on RDS.'
    }],
    ['Slack', {
        name: 'Slack',
        img: slack,
        description: 'Slack is used to communicate and update the team with commits and Git lab changes.'
    }],
    ['Discord', {
        name: 'Discord',
        img: discord,
        description: 'Discord is used to do audio calls and screen share.'
    }],
    ['Docker', {
        name: 'Docker',
        img: docker,
        description: 'Docker holds our Development test environment.'
    }],
    ['React', {
        name: 'React',
        img: react,
        description: 'All of our Front End is in react type-script.'
    }],
    ['Bootstrap', {
        name: 'Bootstrap',
        img: bootstrap,
        description: 'Bootstrap provided us with Component and styles '
    }],
    ['Postman', {
        name: 'Postman',
        img: postman,
        description: 'Postman helped us write our api scheme and test our back apis'
    }],
    ['Gitlab', {
        name: 'Gitlab',
        img: gitlab,
        description: 'Source hosting, CI and tracking issues'
    }]
]);

const sources: Map<string, GitLab.ToolOrSource> = new Map<string, GitLab.ToolOrSource>([
    ['Google', {
        name: 'Google',
        img: google,
        description: 'Google Maps'
    }],
    ['Zillow', {
        name: 'Zillow',
        img: zillow,
        description: 'Housing data and locations'
    }]
]);

function GetCommits(log: Array<GitLab.Commit>) {
    let commiters: Map<string, Array<GitLab.Commit>> = new Map<string, Array<GitLab.Commit>>();
    log.forEach(c => commiters.set(aliases.get(c.author_email) || c.author_email, [...commiters.get(aliases.get(c.author_email) || c.author_email) || [], c]));
    return commiters;
}

function GetIssues(log: Array<GitLab.Issue>) {
    let issueCount: Map<string, number> = new Map<string, number>();
    for (let v of log) {
        // v.closed_by;
        let username: string;
        if (!v.closed_by) console.log("not closed");
        else
            username = v.closed_by.username;
        let name = usernameAliases.get(username) || username;

        if (!issueCount.has(name)) issueCount.set(name, 0);
        let count: number = 1;
        count = issueCount.get(name) + count;
        issueCount.set(name, count);
    }
    return issueCount;
}

function ContributorComponent({contributor, commits, issues, tests}: GitLab.ContributorComponentProps) {
    if (contributor === undefined) return (<div></div>);
    return (
        <Media>
            <div style={{
                marginRight: '15px',
                marginBottom: '15px',
                backgroundImage: `url(${contributor.img})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '200px',
                height: '200px'
            }}>
            </div>
            <Media.Body>
                <span>
                    <h3><b>{contributor.name}</b> | {contributor.responsibilities}</h3>
                </span>
                <p>{contributor.bio}</p>
                <p>commits: {commits} | issues: {issues} | tests: {tests}</p>
            </Media.Body>
        </Media>
    );
}

function ToolComponent({...props}) {
    return (
        <Media>
            <div style={{
                marginRight: '15px',
                marginBottom: '15px',
                backgroundImage: `url(${props.img})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                width: '200px',
                height: '200px'
            }}>
            </div>
            <Media.Body>
                <h3>{props.name}</h3>
                {props.description}
            </Media.Body>
        </Media>
    );
}

function AboutBlerb({...props}) {
    return (
        <div>
            <p>Meet the Dev team - a group of CS students at UT!</p>
        </div>
    );
}

// functionality indeterminate
function AboutPeople({...props}) {
    const [commits, setCommits] = useState(new Map<string, Array<GitLab.Commit>>());
    const [issues, setIssues] = useState(new Map<string, number>());

    useEffect(() => {
        var formData = new FormData();
        formData.set('all', 'true');
        const instance: AxiosInstance = axios.create({
            baseURL: 'https://gitlab.com/api/v4/projects/14418149',
            timeout: 5000,
            // TODO: put token in secrets
            headers: {
                'PRIVATE-TOKEN': '3FtWDYeuQqmnMSBWPr-3',
                'Content-Type': 'multipart/form-data'
            },
            data: formData
        });
        const runCommits = async () => {
            const c = await instance.get('/repository/commits?per_page=100000');

            setCommits(GetCommits(c.data));
        };
        const runIssues = async () => {
            const i = await instance.get('/issues?State=closed&per_page=100000');
            setIssues(GetIssues(i.data));
        };
        runCommits();
        runIssues();
    }, []);


    return (
        <div>
            <h2><strong> Team Members: </strong></h2>
            {
                Array.from(contributors.keys()).map((p, idx) =>
                    <ContributorComponent
                        contributor={contributors.get(p)}
                        commits={(commits.get(p) || []).length}
                        issues={issues.get(p) || 0}
                        tests={0}
                        key={idx}
                    />
                )
            }
            <br/>
        </div>
    );
}

function AboutTools({...props}) {
    return (
        <div>
            <h2><strong> About Tools: </strong></h2>
            {
                Array.from(tools.keys()).map((p) =>
                    <ToolComponent key={uuidv4()}{...tools.get(p)}/>
                )
            }
            <br/>
        </div>
    );
}

function AboutSources({...props}) {
    return (
        <div>
            <h2><strong> About Sources </strong></h2>
            {
                Array.from(sources.keys()).map((p) =>
                    <ToolComponent key={uuidv4()} {...sources.get(p)}/>
                )
            }
            <br/>
        </div>
    );
}

function AboutPage({...props}) {
    return (
        <div>
            <NavigationHeader onClickHandler={null}/>

            <div className='modelPage'>
                <h1>About Us</h1>
                <AboutBlerb/>
                <AboutPeople/>
                <AboutTools/>
                <AboutSources/>
                <p>
                    Our Gitlab repository can be found <a href="https://gitlab.com/lukaoma/phase1">here</a>
                </p>
                <p>
                    Our API documentation can be found <a
                    href="https://documenter.getpostman.com/view/9015613/SVtR1VLR?version=latest">here</a>
                </p>
            </div>
        </div>
    );
}

export default withRouter(AboutPage);
