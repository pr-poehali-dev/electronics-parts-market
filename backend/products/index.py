import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: dict, context) -> dict:
    '''API для управления товарами: получение списка, добавление и редактирование'''
    method = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = psycopg2.connect(os.environ['DATABASE_URL'])
    schema = os.environ['MAIN_DB_SCHEMA']
    
    try:
        if method == 'GET':
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    SELECT 
                        p.id, p.name, p.category, p.device, p.manufacturer,
                        p.compatibility, p.price, p.description, p.image_url,
                        p.in_stock, p.created_at,
                        u.full_name as seller_name
                    FROM {schema}.products p
                    LEFT JOIN {schema}.users u ON p.seller_id = u.id
                    ORDER BY p.created_at DESC
                ''')
                products = cur.fetchall()
            
            products_list = []
            for p in products:
                product_dict = dict(p)
                if product_dict.get('compatibility'):
                    product_dict['compatibility'] = product_dict['compatibility'].split(',')
                if product_dict.get('created_at'):
                    product_dict['created_at'] = product_dict['created_at'].isoformat()
                products_list.append(product_dict)
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'products': products_list}),
                'isBase64Encoded': False
            }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            
            seller_id = body.get('seller_id')
            name = body.get('name')
            category = body.get('category')
            device = body.get('device')
            manufacturer = body.get('manufacturer')
            compatibility = body.get('compatibility', [])
            price = body.get('price')
            description = body.get('description', '')
            image_url = body.get('image_url', '/placeholder.svg')
            in_stock = body.get('in_stock', True)
            
            if not all([seller_id, name, category, device, manufacturer, price]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'Заполните все обязательные поля'}),
                    'isBase64Encoded': False
                }
            
            compatibility_str = ','.join(compatibility) if isinstance(compatibility, list) else compatibility
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(f'''
                    INSERT INTO {schema}.products 
                    (seller_id, name, category, device, manufacturer, compatibility, price, description, image_url, in_stock)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                    RETURNING id, name, category, device, manufacturer, price, in_stock
                ''', (seller_id, name, category, device, manufacturer, compatibility_str, price, description, image_url, in_stock))
                product = cur.fetchone()
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'success': True, 'product': dict(product)}),
                'isBase64Encoded': False
            }
        
        else:
            return {
                'statusCode': 405,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'error': 'Method not allowed'}),
                'isBase64Encoded': False
            }
    
    finally:
        conn.close()
