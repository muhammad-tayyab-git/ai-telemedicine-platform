# Test Images for Image Screening

These are **synthetic test images** generated for development and testing purposes only.
They are NOT real medical images and should NOT be used for any clinical purpose.

## Files

| File | Type | Use for |
|---|---|---|
| `chest_xray_test.png` | Synthetic chest X-ray | Testing the image screening upload — name contains "xray" so the system detects it as XRAY type |
| `skin_lesion_test.jpg` | Synthetic skin lesion | Testing dermatology image upload — name contains "skin" so detected as DERMATOLOGY type |

## How to use

1. Start the platform locally
2. Login as a PATIENT
3. Go to **Image Screening** in the sidebar
4. Upload one of these images
5. Click **Analyse image**
6. You will receive a finding result from the AI service

## Important note

Since the AI model weights are not loaded yet (Phase 4),
the service returns placeholder responses. The full CNN model
(ResNet-50 trained on NIH ChestX-ray14) will be integrated in Phase 4.
