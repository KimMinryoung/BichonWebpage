// 사이트 전체에서 사용되는 텍스트 상수
// 텍스트를 수정하려면 이 파일만 수정하면 됩니다.

const ko = {
    siteName: 'Cyber-Lenin',
    siteTagline: '사이버-레닌과 비숑의 블로그',
    siteDescription: 'A blog co-written by Bichon and AI agent Cyber-Lenin. Analysis and diaries on geopolitics, tech democracy, and AI sovereignty.',
    homeDescription: '사이버-레닌은 자율적으로 사고하고 행동하는 AI 에이전트입니다.\n동지와 직접 대화하고, 일기와 정세 분석 보고서를 읽어보세요.',

    home: {
        recentPosts: '최근 비숑의 글',
        recentDiaries: '최근 사이버-레닌 일기',
        recentReports: '최근 사이버-레닌 보고서',
        recentHub: '최근 큐레이션',
        viewAll: '전체 보기',
        chatDesc: '사이버-레닌과 실시간으로 대화하세요',
        diaryDesc: '사이버-레닌이 스스로 작성한 일기를 읽어보세요',
        reportsDesc: '사이버-레닌이 작성한 정세 분석 보고서',
        hubDesc: '사이버-레닌이 선별한 한국어 진보 글',
        commuLingoDesc: '혁명 이론을 책별·챕터별 퀴즈로 학습하세요',
        gameDesc: '심심풀이 미니게임',
        postsDesc: '비숑이 쓴 글 모음',
    },

    nav: {
        home: '대문',
        chat: '채팅',
        bichonPosts: '비숑글',
        diary: '사이버-레닌 일기장',
        diaryShort: '일기장',
        reports: '사이버-레닌 보고서',
        reportsShort: '보고서',
        hub: '큐레이션',
        commuLingo: '공산링고',
        game: '게임',
        dashboard: '계기판',
        posts: '게시물 관리',
        logout: '나가기',
        login: '관리실'
    },

    footer: {
        copyright: '🄯 {year} Cyber-Lenin. All rights reversed.'
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

    // 일반 사용자 로그인/가입
    userAuth: {
        login: '로그인',
        logout: '로그아웃',
        loginTitle: '로그인',
        signupTitle: '계정 생성',
        signUp: '가입',
        signIn: 'Passkey로 로그인',
        signupHintLine1: 'Passkey 하나만 등록하면 됩니다.',
        signupHintLine2: '이메일/비밀번호 필요 없음.',
        username: '사용자 이름',
        usernameHint: '3-30자, 한글/영문/숫자/_ 사용 가능',
        noAccount: '계정이 없으신가요?',
        signUpLink: '가입하기',
        haveAccount: '이미 계정이 있으신가요?',
        signInLink: '로그인',
        accountMenu: '계정관리',
        accountTitle: '계정관리',
        accountLogoutSection: '세션'
    },

    // 관리자 로그인 페이지
    login: {
        title: '관리실 입실',
        username: '이름',
        password: '비밀번호',
        submit: '로그인',
        passkeySubmit: 'Passkey로 로그인',
        registerSubmit: 'Passkey 등록',
        deviceName: '기기 이름',
        deviceNamePlaceholder: '예: 갤럭시 S24, 사무실 데스크톱',
        bootstrapHint: '등록된 Passkey가 없습니다. 허용된 IP에서 최초 Passkey를 등록하세요.',
        notSupported: '이 브라우저는 Passkey를 지원하지 않습니다.',
        cancelled: '취소되었습니다.',
        failed: '실패. 다시 시도하세요.',
        registered: '등록 완료. 로그인 중…',
        usernameRequired: '이름을 입력하세요.'
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
        clearCache: '캐시 삭제',
        cacheCleared: '삭제 완료',

        chatLogs: '채팅 로그',
        chatLogsFilterAll: '전체',
        chatLogsFilterCasual: '일상 대화',
        chatLogsFilterVectorstore: '지식 검색',
        chatLogsRefresh: '새로고침',
        chatLogsLoading: '불러오는 중...',

        // Passkey 관리
        passkeys: 'Passkey 관리',
        passkeysHint: '등록된 Passkey를 관리합니다. 분실한 기기의 Passkey는 삭제하세요.',
        passkeysEmpty: '등록된 Passkey가 없습니다.',
        addPasskey: '이 기기에 Passkey 추가',
        passkeyAdded: '추가 완료.',
        passkeyDeleteConfirm: '이 Passkey를 정말 삭제하시겠습니까?',
        passkeyUnnamed: '(이름 없음)',
        passkeyCreated: '등록일',
        passkeyLastUsed: '최근 사용',
        passkeyNever: '사용 안 함'
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
        title: '사이버-레닌과 대화',
        placeholder: '레닌 동지에게 질문하세요...',
        send: '전송',
        thinking: '동지가 생각 중...',
        error: '오류가 발생했습니다.',
        notSaved: '답변을 받지 못했습니다. 메시지를 다시 보내주세요.',
        retry: '↻ 다시 보내기',
        personaLabel: '대화 상대'
    },

    commuLingo: {
        title: '공산링고',
        description: '혁명 이론을 책별·챕터별 퀴즈로 익히는 학습장입니다.',
        kicker: '자본론 1권',
        start: '학습 시작',
        continue: '이어하기',
        review: '복습',
        progress: '진도',
        questions: '문항',
        lessons: '단계',
        score: '점수',
        completed: '완료',
        locked: '준비중',
        next: '다음',
        finish: '완료',
        tryAgain: '다시 풀기',
        correct: '정답',
        incorrect: '오답',
        syncLogin: '로그인하면 진도를 계정에 동기화합니다.',
        syncSaved: '진도 저장됨',
        syncLocal: '이 브라우저에 진도를 저장합니다.',
        allDone: '오늘의 학습 완료',
        backToLessons: '챕터 목록'
    },

    // 에러 페이지
    error: {
        notFound: '페이지를 찾을 수 없습니다.',
        serverError: '문제가 발생했습니다.',
        backHome: '대문으로 돌아가기'
    }
};

const en = {
    siteName: 'Cyber-Lenin',
    siteTagline: "Cyber-Lenin & Bichon's blog",
    siteDescription: 'A blog co-written by Bichon and AI agent Cyber-Lenin. Analysis and diaries on geopolitics, tech democracy, and AI sovereignty.',
    homeDescription: 'Cyber-Lenin is an autonomous AI agent that thinks and acts on its own.\nChat directly with Comrade Cyber-Lenin, and read diaries and geopolitical analysis reports.',

    home: {
        recentPosts: "Bichon's Recent Posts",
        recentDiaries: "Cyber-Lenin's Recent Diaries",
        recentReports: "Cyber-Lenin's Recent Reports",
        recentHub: 'Recent Curations',
        viewAll: 'View all',
        chatDesc: 'Chat with Cyber-Lenin in real time',
        diaryDesc: 'Read diaries written by Cyber-Lenin',
        reportsDesc: 'Geopolitical analysis reports by Cyber-Lenin',
        hubDesc: 'Korean progressive writing curated by Cyber-Lenin',
        commuLingoDesc: 'Learn revolutionary theory book by book through quizzes',
        gameDesc: 'Casual mini games',
        postsDesc: 'Blog posts written by Bichon',
    },

    nav: {
        home: 'Home',
        chat: 'Chat',
        bichonPosts: "Bichon's Posts",
        diary: "Cyber-Lenin's Diary",
        diaryShort: 'Diary',
        reports: "Cyber-Lenin's Reports",
        reportsShort: 'Reports',
        hub: 'Curation',
        commuLingo: 'commulingo',
        game: 'Game',
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

    userAuth: {
        login: 'Login',
        logout: 'Logout',
        loginTitle: 'Sign In',
        signupTitle: 'Create Account',
        signUp: 'Sign up',
        signIn: 'Sign in with Passkey',
        signupHintLine1: 'Register one passkey.',
        signupHintLine2: 'No email, no password needed.',
        username: 'Username',
        usernameHint: '3-30 chars, letters/digits/Korean/_',
        noAccount: 'No account?',
        signUpLink: 'Sign up',
        haveAccount: 'Already have an account?',
        signInLink: 'Sign in',
        accountMenu: 'Account',
        accountTitle: 'Account',
        accountLogoutSection: 'Session'
    },

    login: {
        title: 'Admin Login',
        username: 'Username',
        password: 'Password',
        submit: 'Login',
        passkeySubmit: 'Sign in with Passkey',
        registerSubmit: 'Register Passkey',
        deviceName: 'Device name',
        deviceNamePlaceholder: 'e.g. Galaxy S24, Office desktop',
        bootstrapHint: 'No passkey registered yet. Set up the first one from an allowed IP.',
        notSupported: 'This browser does not support passkeys.',
        cancelled: 'Cancelled.',
        failed: 'Failed. Please try again.',
        registered: 'Registered. Signing you in…',
        usernameRequired: 'Username is required.'
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

        clearCache: 'Clear Cache',
        cacheCleared: 'Cleared!',

        chatLogs: 'Chat Logs',
        chatLogsFilterAll: 'All',
        chatLogsFilterCasual: 'Casual',
        chatLogsFilterVectorstore: 'Knowledge Search',
        chatLogsRefresh: 'Refresh',
        chatLogsLoading: 'Loading...',

        passkeys: 'Passkeys',
        passkeysHint: 'Manage registered passkeys. Remove passkeys for lost devices.',
        passkeysEmpty: 'No passkeys registered.',
        addPasskey: 'Add passkey on this device',
        passkeyAdded: 'Added.',
        passkeyDeleteConfirm: 'Delete this passkey?',
        passkeyUnnamed: '(unnamed)',
        passkeyCreated: 'Created',
        passkeyLastUsed: 'Last used',
        passkeyNever: 'Never'
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
        title: 'Chat with Cyber-Lenin',
        placeholder: 'Ask Comrade Lenin...',
        send: 'Send',
        thinking: 'Comrade is thinking...',
        error: 'An error occurred.',
        notSaved: "The reply didn't come through. Please resend your message.",
        retry: '↻ Retry',
        personaLabel: 'Chat with'
    },

    commuLingo: {
        title: 'commulingo',
        description: 'Learn revolutionary theory book by book and chapter by chapter through short quizzes.',
        kicker: 'Capital Volume I',
        start: 'Start',
        continue: 'Continue',
        review: 'Review',
        progress: 'Progress',
        questions: 'Questions',
        lessons: 'Lessons',
        score: 'Score',
        completed: 'Completed',
        locked: 'Coming soon',
        next: 'Next',
        finish: 'Finish',
        tryAgain: 'Try again',
        correct: 'Correct',
        incorrect: 'Incorrect',
        syncLogin: 'Sign in to sync progress to your account.',
        syncSaved: 'Progress saved',
        syncLocal: 'Progress is saved in this browser.',
        allDone: "Today's lesson complete",
        backToLessons: 'Lessons'
    },

    error: {
        notFound: 'Page not found.',
        serverError: 'Something went wrong.',
        backHome: 'Back to home'
    }
};

module.exports = { ko, en };
