// 사이트 전체에서 사용되는 텍스트 상수
// 텍스트를 수정하려면 이 파일만 수정하면 됩니다.

const ko = {
    siteName: '비숑집',
    siteTagline: '비숑의 아늑한 집',

    nav: {
        home: '대문',
        chat: '사이버-레닌',
        diary: 'AI 일기장',
        reports: 'AI 보고서',
        game: '웹 게임',
        dashboard: '계기판',
        posts: '게시물 관리',
        logout: '나가기',
        login: '관리실'
    },

    footer: {
        copyright: '🄯 {year} 비숑집. All rights reversed.'
    },

    // 공개 페이지
    public: {
        noPosts: '글이 아직 없다.',
        postedAt: '에 올림',
        updatedAt: '에 고침',
        backToList: '목록',
        noDiaries: '아직 작성된 일기가 없습니다.',
        deleteDiaryConfirm: '정말 이 일기를 삭제하시겠습니까?',
        chatHistory: '이전 대화',
        prevPost: '이전',
        nextPost: '다음'
    },

    // 로그인 페이지
    login: {
        title: '관리실 입실',
        username: '이름',
        password: '비밀번호',
        submit: '로그인'
    },

    // 관리자 페이지
    admin: {
        dashboard: '계기판',
        createPost: '새 글 쓰기',
        managePosts: '게시물 관리',
        totalPosts: '전체 게시물',
        recentPosts: '이번 달 게시물',
        quickActions: '빠른 작업',
        viewSite: '사이트 보기',
        storyEditor: '스토리 편집기',
        recentPostsTitle: '최근 게시물',

        // 게시물 관리
        postId: 'ID',
        postTitle: '제목',
        postCreated: '작성일',
        postActions: '작업',
        edit: '고치기',
        delete: '삭제',
        deleteConfirm: '정말 이 게시물을 삭제하시겠습니까?',
        noPostsYet: '게시물이 없습니다.',
        createFirst: '첫 게시물을 작성하세요',

        // 게시물 편집
        editPost: '게시물 수정',
        newPost: '새 게시물',
        backToPosts: '목록으로',
        titleLabel: '제목',
        contentLabel: '내용',
        update: '수정',
        create: '작성',
        cancel: '취소',

        // 링크 삽입
        insertLink: '링크 삽입',
        linkUrl: 'URL',
        linkTitle: '툴팁',
        linkText: '텍스트',
        linkInsert: '삽입',
        linkCancel: '취소',

        // 채팅 로그
        chatLogs: '채팅 로그',
        chatLogsFilterAll: '전체',
        chatLogsFilterCasual: '일상 대화',
        chatLogsFilterVectorstore: '지식 검색',
        chatLogsRefresh: '새로고침',
        chatLogsLoading: '불러오는 중...'
    },

    // 스토리 편집기
    storyEditor: {
        title: '스토리 편집기',
        files: '파일',
        selectFile: '파일 선택...',
        scenes: '장면',
        selectScene: '장면을 선택하세요',
        location: '장소',
        save: '저장',
        script: '대본 (한 줄에 하나씩)',
        actions: '선택지 (한 줄에 하나씩)',
        placeholder: '파일과 장면을 선택해서 편집을 시작하세요.'
    },

    // 채팅 페이지
    chat: {
        title: '사이버-레닌',
        placeholder: '레닌 동지에게 질문하세요...',
        send: '전송',
        thinking: '동지가 생각 중...',
        error: '오류가 발생했습니다. 다시 시도해주세요.',
        disconnectError: '다른 탭에 있는 동안 연결이 끊겼습니다. "이전 대화" 버튼으로 답변을 확인해 보세요.'
    },

    // 에러 페이지
    error: {
        notFound: '페이지를 찾을 수 없습니다.',
        serverError: '문제가 발생했습니다.',
        backHome: '대문으로 돌아가기'
    }
};

const en = {
    siteName: 'Bichon House',
    siteTagline: "Bichon's Cozy Home",

    nav: {
        home: 'Home',
        chat: 'Cyber-Lenin',
        diary: 'AI Diary',
        reports: 'Task Reports',
        game: 'Web Game',
        dashboard: 'Dashboard',
        posts: 'Manage Posts',
        logout: 'Logout',
        login: 'Admin'
    },

    footer: {
        copyright: '🄯 {year} Bichon House. All rights reversed.'
    },

    public: {
        noPosts: 'No posts yet.',
        postedAt: ', posted',
        updatedAt: ', updated',
        backToList: 'List',
        noDiaries: 'No diary entries yet.',
        deleteDiaryConfirm: 'Are you sure you want to delete this diary entry?',
        chatHistory: 'History',
        prevPost: 'Prev',
        nextPost: 'Next'
    },

    login: {
        title: 'Admin Login',
        username: 'Username',
        password: 'Password',
        submit: 'Login'
    },

    admin: {
        dashboard: 'Dashboard',
        createPost: 'New Post',
        managePosts: 'Manage Posts',
        totalPosts: 'Total Posts',
        recentPosts: 'Posts This Month',
        quickActions: 'Quick Actions',
        viewSite: 'View Site',
        storyEditor: 'Story Editor',
        recentPostsTitle: 'Recent Posts',

        postId: 'ID',
        postTitle: 'Title',
        postCreated: 'Created',
        postActions: 'Actions',
        edit: 'Edit',
        delete: 'Delete',
        deleteConfirm: 'Are you sure you want to delete this post?',
        noPostsYet: 'No posts yet.',
        createFirst: 'Create your first post',

        editPost: 'Edit Post',
        newPost: 'New Post',
        backToPosts: 'Back to list',
        titleLabel: 'Title',
        contentLabel: 'Content',
        update: 'Update',
        create: 'Create',
        cancel: 'Cancel',

        insertLink: 'Insert Link',
        linkUrl: 'URL',
        linkTitle: 'Tooltip',
        linkText: 'Text',
        linkInsert: 'Insert',
        linkCancel: 'Cancel',

        chatLogs: 'Chat Logs',
        chatLogsFilterAll: 'All',
        chatLogsFilterCasual: 'Casual',
        chatLogsFilterVectorstore: 'Knowledge Search',
        chatLogsRefresh: 'Refresh',
        chatLogsLoading: 'Loading...'
    },

    storyEditor: {
        title: 'Story Editor',
        files: 'Files',
        selectFile: 'Select file...',
        scenes: 'Scenes',
        selectScene: 'Select a scene',
        location: 'Location',
        save: 'Save',
        script: 'Script (one per line)',
        actions: 'Choices (one per line)',
        placeholder: 'Select a file and scene to start editing.'
    },

    chat: {
        title: 'Cyber-Lenin',
        placeholder: 'Ask Comrade Lenin...',
        send: 'Send',
        thinking: 'Comrade is thinking...',
        error: 'An error occurred. Please try again.',
        disconnectError: 'Disconnected while you were on another tab. Check the "History" button for the answer.'
    },

    error: {
        notFound: 'Page not found.',
        serverError: 'Something went wrong.',
        backHome: 'Back to home'
    }
};

module.exports = { ko, en };
