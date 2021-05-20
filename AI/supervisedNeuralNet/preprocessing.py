import os


data_path = 'E:\GolfData'
out_path = "E:\GolfData\grayscaled\\"

for clip in os.listdir(data_path):
    if os.path.splitext(clip)[1] == '.mp4':
        filePath = os.path.join(data_path, clip)
        os.system(f"ffmpeg -i {filePath} -vf hue=s=0 {out_path + clip}")