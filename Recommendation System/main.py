# import pymysql
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# from flask import Flask, jsonify, request
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# server = 'localhost'
# database = 'ecommerce'
# username = 'root'
# password = '43danang211'

# connection_string = f'mysql+pymysql://{username}:{password}@{server}/{database}'

# try:
#     conn = pymysql.connect(
#         host=server,
#         database=database,
#         user=username,
#         password=password,
#         charset='utf8mb4'
#     )
    
#     query = 'SELECT * FROM product'
#     df_sanpham = pd.read_sql(query, conn)
    
#     conn.close()
    
# except Exception as e:
#     print(f"Lỗi: {e}")

# # Gom đặc trưng
# features = ['description', 'price']

# def combineFeatures(row):
#     return str(row['price']) + " " + str(row['description'])

# df_sanpham['combinedFeatures'] = df_sanpham.apply(combineFeatures, axis=1)
# # print(df_sanpham['combinedFeatures'].head())

# # Chuyển đổi dataframe thành các vector TF_IDF
# tf = TfidfVectorizer()
# tfMatrix = tf.fit_transform(df_sanpham['combinedFeatures'])

# # Tính sự tương đồng
# similar = cosine_similarity(tfMatrix)

# number = 18
# @app.route('/api', methods=['GET'])
# def get_data():
#     ket_qua = []
#     productId = request.args.get('id')
#     productId = int(productId)

#     if productId not in df_sanpham['id'].values:
#         return jsonify({'loi':'id khong hop le'})
    
#     indexproduct = df_sanpham[df_sanpham['id'] == productId].index[0]

#     similarProduct = list(enumerate(similar[indexproduct]))

#     sortedSimilarProduct = sorted(similarProduct, key=lambda x:x[1], reverse=True)

#     def lay_ten(index):
#         return (df_sanpham[df_sanpham.index == index]['name'].values[0])

#     for i in range(1, number + 1):
#         print(lay_ten(sortedSimilarProduct[i][0]))
#         ket_qua.append(lay_ten(sortedSimilarProduct[i][0]))

#     data = {'san pham goi y':ket_qua}
#     return jsonify(data)

# if __name__ == '__main__':
#     app.run(port=5555)

import pymysql
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Cho phép CORS để frontend gọi được API

server = 'localhost'
database = 'ecommerce'
username = 'root'
password = '43danang211'

connection_string = f'mysql+pymysql://{username}:{password}@{server}/{database}'

try:
    conn = pymysql.connect(
        host=server,
        database=database,
        user=username,
        password=password,
        charset='utf8mb4'
    )
    
    query = 'SELECT * FROM product'
    df_sanpham = pd.read_sql(query, conn)
    
    conn.close()
    
except Exception as e:
    print(f"Lỗi: {e}")

# Gom đặc trưng
def combineFeatures(row):
    description = str(row['description']) if pd.notna(row['description']) else ""
    price = str(row['price']) if pd.notna(row['price']) else ""
    return price + " " + description

df_sanpham['combinedFeatures'] = df_sanpham.apply(combineFeatures, axis=1)

# Chuyển đổi dataframe thành các vector TF_IDF
tf = TfidfVectorizer()
tfMatrix = tf.fit_transform(df_sanpham['combinedFeatures'])

# Tính sự tương đồng
similar = cosine_similarity(tfMatrix)

@app.route('/api/recommendations', methods=['GET'])
def get_recommendations():
    try:
        product_id = request.args.get('id')
        page = int(request.args.get('page', 1))
        size = int(request.args.get('size', 6))  # Mặc định 6 sản phẩm mỗi trang
        
        if not product_id:
            return jsonify({'error': 'Thiếu tham số id'})
        
        product_id = int(product_id)

        if product_id not in df_sanpham['id'].values:
            return jsonify({'error': 'ID sản phẩm không hợp lệ'})
        
        # Tìm index của sản phẩm
        index_product = df_sanpham[df_sanpham['id'] == product_id].index[0]

        # Tính toán sản phẩm tương tự
        similar_products = list(enumerate(similar[index_product]))
        sorted_similar_products = sorted(similar_products, key=lambda x: x[1], reverse=True)

        # Bỏ qua sản phẩm đầu tiên (chính nó) và lấy các sản phẩm tương tự
        similar_indices = [item[0] for item in sorted_similar_products[1:]]
        
        # Tính toán phân trang
        total_items = len(similar_indices)
        total_pages = (total_items + size - 1) // size
        start_index = (page - 1) * size
        end_index = start_index + size
        
        # Lấy sản phẩm cho trang hiện tại
        current_page_indices = similar_indices[start_index:end_index]
        
        # Lấy thông tin đầy đủ của sản phẩm
        recommended_products = []
        for idx in current_page_indices:
            product_row = df_sanpham.iloc[idx]
            product_info = {
                'id': int(product_row['id']),
                'name': product_row['name'],
                'price': float(product_row['price']) if pd.notna(product_row['price']) else 0,
                'thumbnail': product_row['thumbnail'] if pd.notna(product_row['thumbnail']) else '',
                'buyTurn': int(product_row['buy_turn']) if pd.notna(product_row['buy_turn']) else 0,
                'description': product_row['description'] if pd.notna(product_row['description']) else '',
                'quantityInStock': int(product_row['quantity_in_stock']) if pd.notna(product_row['quantity_in_stock']) else 0
            }
            recommended_products.append(product_info)

        response = {
            'content': recommended_products,
            'totalPages': total_pages,
            'currentPage': page,
            'totalElements': total_items
        }
        
        return jsonify({'result': response})
        
    except ValueError as e:
        return jsonify({'error': 'Tham số không hợp lệ'})
    except Exception as e:
        return jsonify({'error': f'Lỗi server: {str(e)}'})

if __name__ == '__main__':
    app.run(port=5555, debug=True)