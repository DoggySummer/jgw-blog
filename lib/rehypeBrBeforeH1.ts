import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

const brNode = {
  type: "element",
  tagName: "br",
  properties: {},
  children: [],
} as const;

/**
 * 첫 번째 h1을 제외한 모든 h1 앞에 <br />를 삽입합니다.
 * (맨 위 h1에는 br 없음, 두 번째 h1부터 위에 br)
 * 방문 중 트리를 변경하면 반복이 꼬여서 크래시할 수 있으므로, 먼저 위치를 수집한 뒤 한 번에 삽입합니다.
 */
const rehypeBrBeforeH1: Plugin = () => (tree) => {
  let firstH1 = true;
  const toInsert: { parent: { children: unknown[] }; index: number }[] = [];
  visit(tree, "element", (node, index, parent) => {
    if ((node as { tagName: string }).tagName !== "h1") return;
    if (firstH1) {
      firstH1 = false;
      return;
    }
    if (parent && typeof index === "number") {
      toInsert.push({ parent: parent as { children: unknown[] }, index });
    }
  });
  // 인덱스 큰 것부터 삽입해야 기존 인덱스가 유효함
  toInsert.sort((a, b) => b.index - a.index);
  for (const { parent, index } of toInsert) {
    parent.children.splice(index, 0, { ...brNode });
  }
};

export default rehypeBrBeforeH1;
