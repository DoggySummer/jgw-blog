/**
 * 목록 항목에서 "- 라벨 : 설명" 형식일 때, 라벨( - 와 : 사이)을 볼드 처리합니다.
 * 예: "- jwt : 토큰입니다." → "- **jwt** : 토큰입니다."
 */
export function transformListLabelBold(markdown: string): string {
  return markdown.replace(/^(\s*)- (.+?) : /gm, "$1- **$2** : ");
}
