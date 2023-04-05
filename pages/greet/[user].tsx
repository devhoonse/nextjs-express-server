/**
 * 요청받은 페이지에 대한 렌더링 전에 실행할 함수입니다.
 * * URL 라우트 경로 파라미터인 ${user} 값을 읽어서 페이지 컴포넌트로 전달합니다.
 * @param request
 */
export function getServerSideProps(request: { params: { user: string } }) {
  return {
    props: {
      user: request.params.user
    }
  };
}

/**
 * 페이지 : /greet/${user}
 * @param user
 * @constructor
 */
function GreetUserPage({ user }: { user: string }) {
  // 페이지 컴포넌트 구조
  return (
    <div>
      <h1>
        Hello {user}!
      </h1>
    </div>
  );
}
export default GreetUserPage;
