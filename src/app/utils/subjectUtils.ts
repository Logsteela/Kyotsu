export function getDisplaySubject(subject: string): string {
  const hashIndex = subject.indexOf('#');
  if (hashIndex === -1) {
    return subject;
  }
  return subject.substring(0, hashIndex);
}


export function getInternalSubject(subject: string): string {
  return subject;
}


export function getSubjectForFilename(subject: string): string {
  return getDisplaySubject(subject);
}
