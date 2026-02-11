// 사이트 전체에서 사용되는 텍스트 상수
// 텍스트를 수정하려면 이 파일만 수정하면 됩니다.

module.exports = {
    siteName: '비숑집',
    siteTagline: '비숑의 아늑한 집',

    nav: {
        home: '대문',
        chat: '사이버-레닌',
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
        backToList: '목록'
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
        linkCancel: '취소'
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
        error: '오류가 발생했습니다. 다시 시도해주세요.'
    },

    // 에러 페이지
    error: {
        notFound: '페이지를 찾을 수 없습니다.',
        serverError: '문제가 발생했습니다.',
        backHome: '대문으로 돌아가기'
    }
};
