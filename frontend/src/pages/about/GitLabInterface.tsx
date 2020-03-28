export interface Commit {
    id: string
    short_id: string
    created_at: string
    title: string
    message: string
    author_name: string
    author_email: string
    committer_name: string
    committer_email: string
    committed_date: string
}

export interface ToolOrSource {
    name: string;
    img: string;
    description: string;
}

export interface Contributor {
    name: string
    img: string
    bio: string
    responsibilities: string
}

export interface ContributorComponentProps {
    contributor: Contributor | undefined
    commits: number
    issues: number
    tests: number
}

export interface GitlabUser {
    id: number
    name: string
    username: string
    state: string
    avatar_url: string
    web_url: string
}

export interface Issue {
    id: number
    iid: number
    project_id: number
    title: string
    description: string
    closed_by: GitlabUser
}
