SCHEMA = {
    "features": {
        "fit": {
            "sizing": ["true to size", "runs small", "runs large", "other"],
            "silhouette": [
                "flattering",
                "comfortable",
                "loose",
                "boxy",
                "fitted",
                "flowy",
                "other",
            ],
            "body_area_fit": {
                "waist": [
                    "high-waisted",
                    "low-waisted",
                    "empire waist",
                    "natural waist",
                    "other",
                ],
                "hips": ["tight", "loose", "just right"],
                "length": ["long", "short", "midi", "maxi", "cropped", "other"],
            },
        },
        "style": {
            "aesthetic": [
                "classic",
                "trendy",
                "bohemian",
                "romantic",
                "vintage",
                "minimalistic",
                "other",
            ],
        },
        "quality": {
            "construction": ["well-made", "cheap", "other"],
        },
    },
    "issues": [
        "zipper_problems",
        "see-through",
        "fabric_quality",
        "inconsistent_sizing",
        "arm_hole_issues",
        "unflattering",
        "itchy",
        "too_short",
        "too_long",
        "too_tight",
        "too_loose",
        "shrinkage",
        "other",
    ],
    "sentiment": ["positive", "negative", "neutral"],
}

FULL_SCHEMA = {
    "clothing_id": "int",
    "age": "int",
    "title": "string",
    "review_text": "string",
    "rating": "int",
    "recommended": "bool",
    "positive_feedback_count": "int",
    "division_name": "string",
    "department_name": "string",
    "class_name": "string",
    "features": SCHEMA["features"],
    "issues": SCHEMA["issues"],
    "sentiment": SCHEMA["sentiment"],
}

MODIFIED_SCHEMA = {
    "photo": "file",
    "country": "string",
    "location": "string",
    "date": "string",
    "companion": "string",
    "highlights": "string",
    "userProfile": "string"
}