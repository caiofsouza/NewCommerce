# Products 

{
	name: string,
	code: string,
	skus: [ 
		{
			sku_id: string,
			color: string,
			height: int,
			weight: int,
			width: int,
			count: int,
			size: int,
			price: float,
			images [
				{
					url: string,
					cover: boolean
				}
			],
		}
	],
	categories: [ ObjectId ],
	onMarketPlace: boolean,
	active: boolean,
	created_at: dateTime
}



# Categories
{
	name: string,
	sub_category: [
		{
			name: string,
			sub_category: (can exists or not)
		}
	]
}


# Collections
{
	name: string,
	products: [ ObjectId ],
	created_at: dateTime
}


# Users
{
	name: string,
	facebook_id: int,
	email: string,
	password: string,
	age: int,
	cover_img: string,
	address: [
		{
			name: string,
			street: string,
			number: int,
			compl: string,
			city: string,
			state: string,
			country: string
		}
	],
	active: boolean,
	created_at: dateTime


}


# Orders


