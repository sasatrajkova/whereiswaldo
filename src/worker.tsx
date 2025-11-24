import { pipeline } from '@huggingface/transformers';

class AvatarGenerationPipeline {
  static task = 'image-text-to-text' as const;
  static model = 'llava-hf/llava-onevision-qwen2-0.5b-ov-hf';
  static instance: unknown = null;

  static async getInstance(progress_callback?: (progress: unknown) => void) {
    if (!this.instance) {
      this.instance = await pipeline(
        this.task as unknown as 'text-generation',
        this.model,
        { progress_callback }
      );
    }
    return this.instance;
  }
}

export default AvatarGenerationPipeline;
