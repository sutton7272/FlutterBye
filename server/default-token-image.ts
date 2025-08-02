import { storage } from "./storage";

/**
 * Utility for managing default token images
 */
export class DefaultTokenImageService {
  private static DEFAULT_IMAGE_PATH = "/assets/image_1754114527645.png"; // Butterfly logo

  /**
   * Get the current default token image URL
   */
  static async getDefaultTokenImage(): Promise<string> {
    try {
      const setting = await storage.getSystemSetting("default_token_image");
      return setting?.value || this.DEFAULT_IMAGE_PATH;
    } catch (error) {
      console.warn("Failed to get default token image setting, using fallback:", error);
      return this.DEFAULT_IMAGE_PATH;
    }
  }

  /**
   * Update the default token image (admin only)
   */
  static async updateDefaultTokenImage(newImageUrl: string): Promise<string> {
    try {
      const existing = await storage.getSystemSetting("default_token_image");
      
      if (existing) {
        await storage.updateSystemSetting("default_token_image", newImageUrl);
      } else {
        await storage.createSystemSetting({
          key: "default_token_image",
          value: newImageUrl,
          category: "tokens",
          description: "Default image used for tokens when no custom image is uploaded",
          dataType: "image_url",
          isEditable: true,
        });
      }

      return newImageUrl;
    } catch (error) {
      console.error("Failed to update default token image:", error);
      throw new Error("Failed to update default token image");
    }
  }

  /**
   * Apply default image to a token if no image is provided
   */
  static async applyDefaultImageIfNeeded(tokenData: any): Promise<any> {
    if (!tokenData.image || tokenData.image.trim() === "") {
      const defaultImage = await this.getDefaultTokenImage();
      return {
        ...tokenData,
        image: defaultImage,
      };
    }
    return tokenData;
  }
}