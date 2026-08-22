use rand::seq::SliceRandom;
use rand::Rng;

const ADJECTIVES: &[&str] = &[
    "swift", "clever", "bright", "brave", "calm", "crisp", "epic", "grand", "keen", "bold",
    "noble", "prime", "quick", "sharp", "stellar", "warm", "vivid", "zen", "agile", "cosmic",
];

const NOUNS: &[&str] = &[
    "badger", "falcon", "otter", "fox", "hawk", "lynx", "panda", "tiger", "wolf", "bear",
    "eagle", "dolphin", "jaguar", "panther", "rhino", "whale", "bison", "cobra", "gecko", "koala",
];

pub fn generate_slug() -> String {
    let mut rng = rand::thread_rng();
    let adj = ADJECTIVES.choose(&mut rng).unwrap_or(&"swift");
    let noun = NOUNS.choose(&mut rng).unwrap_or(&"badger");
    let num: u32 = rng.gen_range(10..99);
    format!("{}-{}-{}", adj, noun, num)
}

pub fn generate_short_code(slug: &str) -> String {
    let parts: Vec<&str> = slug.split('-').collect();
    if parts.len() >= 3 {
        let p1 = parts[0].chars().next().unwrap_or('S').to_ascii_uppercase();
        let p2 = parts[1].chars().next().unwrap_or('B').to_ascii_uppercase();
        let p3 = parts[1].chars().nth(1).unwrap_or('W').to_ascii_uppercase();
        let num = parts[2];
        format!("{}{}{}-{}", p1, p2, p3, num)
    } else {
        let mut rng = rand::thread_rng();
        let num: u32 = rng.gen_range(10..99);
        format!("SWB-{}", num)
    }
}

pub fn validate_slug(slug: &str) -> bool {
    !slug.trim().is_empty()
        && slug.len() <= 64
        && slug
            .chars()
            .all(|c| c.is_ascii_alphanumeric() || c == '-' || c == '_')
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_slug_generation() {
        let slug = generate_slug();
        assert!(validate_slug(&slug));
        let code = generate_short_code(&slug);
        assert!(code.contains('-'));
        assert_eq!(code.len(), 6);
    }
}
