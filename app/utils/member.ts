// 判斷名稱是否重複
export function isDuplicateMemberName(name: string, members: { name: string }[]): boolean {
  return members.some(
    (member) => member.name.toLowerCase() === name.toLowerCase()
  );
}
