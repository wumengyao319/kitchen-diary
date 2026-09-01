import os, re, shutil

base = r'C:\Users\17493\Desktop\recipe-mini-app(1)'
img_dir = os.path.join(base, 'images', 'recipes')
js_file = os.path.join(base, 'data', 'recipes.js')
backup = os.path.join(base, 'data', 'recipes.js.bak')

# 1. 备份
shutil.copy2(js_file, backup)
print('已备份:', backup)

# 2. 收集 dish_ 菜名 -> 文件名
dish_files = {}
for f in os.listdir(img_dir):
    if f.startswith('dish_') and f.endswith('.jpg'):
        name = f[5:-4]  # 去掉 dish_ 和 .jpg
        dish_files[name] = f
print('dish 图菜名数:', len(dish_files))

# 3. 读 recipes.js 逐行处理
with open(js_file, encoding='utf-8') as f:
    content = f.read()

lines = content.split('\n')
new_lines = []
matched = []
for line in lines:
    m = re.search(r"name: '([^']+)'", line)
    if m:
        dish = m.group(1)
        if dish in dish_files:
            new_img = '/images/recipes/' + dish_files[dish]
            if re.search(r"img:\s*'/images/recipes/", line):
                # 替换已有的 img 值
                line = re.sub(r"img:\s*'/images/recipes/[^']*'", "img: '" + new_img + "'", line)
            else:
                # 没有 img 字段，在 name 后插入
                line = line.replace("name: '" + dish + "'", "name: '" + dish + "', img: '" + new_img + "'", 1)
            matched.append(dish)
    new_lines.append(line)

with open(js_file, 'w', encoding='utf-8') as f:
    f.write('\n'.join(new_lines))

print('更新了', len(matched), '道菜的 img -> dish_ 图')

# 4. 验证
with open(js_file, encoding='utf-8') as f:
    c = f.read()
dish_refs = len(re.findall(r"/images/recipes/dish_", c))
num_refs = len(re.findall(r"/images/recipes/\d+\.jpg", c))
no_img = 0
for line in c.split('\n'):
    if re.search(r"_id: '\d+'", line) and 'img:' not in line and 'module.exports' not in line and line.strip().startswith('{'):
        no_img += 1
print('验证: dish_ 引用', dish_refs, '处, 仍用数字.jpg', num_refs, '处, 无 img 的 recipe', no_img, '个')
