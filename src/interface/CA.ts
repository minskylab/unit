export interface CA<I = any, O = any> {
  draw(step: any[]): Promise<void>
  toBlob(type: string, quality: number): Promise<Blob>
}
