// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

//use std::env::current_dir;

use std::path::PathBuf;

#[tauri::command]
fn display_dirs() -> Vec<(String, String)> {
    let mut vec: Vec<(String, String)> = Vec::new();
    if let Ok(path) = std::env::current_dir() {
        for entry in std::fs::read_dir(path).unwrap() {
            if let Ok(entry) = entry {
                if let Some(file_name) = entry.file_name().to_str() {
                    let file_type = if entry.file_type().unwrap().is_dir() {
                        "Directory".to_string()
                    } else {
                        "File".to_string()
                    };
                    vec.push((file_name.to_string(), file_type));
                }
            }
        }
    }

    vec.sort_by(|(a, _), (b, _)| {
        if a == b {
            std::cmp::Ordering::Equal
        } else if a.starts_with('.') && !b.starts_with('.') {
            std::cmp::Ordering::Greater
        } else if !a.starts_with('.') && b.starts_with('.') {
            std::cmp::Ordering::Less
        } else {
            a.cmp(b)
        }
    });
    vec
}

#[tauri::command]
fn go_back() -> String {
    if let Ok(current) = std::env::current_dir() {
        if let Some(parent) = current.parent() {
            if parent.is_dir() {
                if let Err(error) = std::env::set_current_dir(parent) {
                    return "Failed to change directory:".to_string();
                } else {
                    return "ok".to_string();
                }
            } else {
                return "No parent directory found".to_string();
            }
        } else {
            return "Already in the root directory".to_string();
        }
    } else {
        return "Failed to get the current directory".to_string();
    }
}

#[tauri::command]
fn go_dir(folder_name: &str) -> String {
    let mut current_dir = std::env::current_dir().expect("Failed to get current directory");
    current_dir.push(folder_name);

    if let Err(error) = std::env::set_current_dir(&current_dir) {
        return "Failed to change directory ".to_string();
    } else {
        return "ok".to_string();
    }
}

#[tauri::command]
fn get_dir_string() -> String {
    if let Ok(current_dir) = std::env::current_dir() {
        if let Some(dir) = current_dir.to_str() {
            return dir.to_string();
        }
    }
    String::new()
}

#[tauri::command]
fn search_dir(user_path: &str) {
    let path = std::path::Path::new(user_path);
    if let Err(error) = std::env::set_current_dir(path) {
        println!("Failed to change directory: {}", error);
    } else {
        println!("Successfully changed directory to: {:?}", path);
    }
}

#[tauri::command]
fn create_folder(name: &str) {
    if let Err(error) = std::fs::create_dir(name) {
        eprintln!("Failed to create folder: {}", error);
    } else {
        println!("Folder created successfully!");
    }
}

#[tauri::command]
fn create_file(name: &str) {
    let _file = match std::fs::File::create(name) {
        Ok(file) => file,
        Err(error) => {
            eprintln!("Failed to create file: {}", error);
            return;
        }
    };
}

#[tauri::command]
fn delete_all(path: &str) -> PathBuf {
    let mut current_dir = std::env::current_dir().expect("Failed to get current directory");
    current_dir.push(path);

    if let Err(error) = std::fs::remove_file(&current_dir) {
        if let Err(error) = std::fs::remove_dir_all(&current_dir) {
            eprintln!("Failed to delete file or folder: {}", error);
        }
    }

    current_dir
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            display_dirs,
            go_back,
            go_dir,
            get_dir_string,
            search_dir,
            create_folder,
            create_file,
            delete_all,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
