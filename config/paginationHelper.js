// paginationHelper.js - 페이지네이션 범위 계산 헬퍼
module.exports = function(currentPage, totalPages) {
    var pages = [];
    var startPage, endPage;

    if (totalPages <= 7) {
        // 페이지가 적으면 모두 표시
        startPage = 1;
        endPage = totalPages;
    } else {
        // 현재 페이지를 중심으로 ±2 페이지 표시
        startPage = Math.max(1, currentPage - 2);
        endPage = Math.min(totalPages, currentPage + 2);

        // 범위 조정 (항상 5 개 페이지 표시)
        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(totalPages, startPage + 4);
            } else if (endPage === totalPages) {
                startPage = Math.max(1, endPage - 4);
            }
        }
    }

    for (var i = startPage; i <= endPage; i++) {
        pages.push(i);
    }

    return {
        pages: pages,
        showFirst: startPage > 1,
        showLast: endPage < totalPages,
        showPrev: currentPage > 1,
        showNext: currentPage < totalPages,
        hasPrevEllipsis: startPage > 2,
        hasNextEllipsis: endPage < totalPages - 1
    };
};
