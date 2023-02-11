export default function classMerge(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
