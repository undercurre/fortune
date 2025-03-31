<template>
	<view class="container">
		<!-- 性别选择 -->
		<view class="form-item">
			<text class="label">性别：</text>
			<picker mode="selector" :range="genderOptions" @change="selectGender">
				<view class="picker-text">{{ userInfo.gender || '请选择' }}</view>
			</picker>
		</view>

		<!-- 生日选择 -->
		<view class="form-item">
			<text class="label">生日：</text>
			<picker mode="date" :value="userInfo.birthday" @change="selectBirthday">
				<view class="picker-text">{{ userInfo.birthday || '请选择' }}</view>
			</picker>
		</view>


		<view class="form-item">
			<text class="label">出生时间：</text>
			<picker mode="time" :value="userInfo.birthTime" @change="selectBirthTime">
				<view class="picker-text">{{ userInfo.birthTime || '请选择' }}</view>
			</picker>
		</view>

		<!-- 省市区选择 -->
		<view class="form-item">
			<text class="label">地址：</text>
			<picker mode="multiSelector" :value="regionIndex" :range="regionList" @change="selectRegion">
				<view class="picker-text">
					{{ userInfo.region.length ? userInfo.region.join(" ") : '请选择省市区' }}
				</view>
			</picker>
		</view>

		<!-- 提交按钮 -->
		<button type="primary" @click="submitForm">提交</button>
	</view>
</template>

<script>
	import chinaData from '../../static/json/china.json'
	export default {
		data() {
			return {
				userInfo: {
					gender: '',
					birthday: '',
					region: [] // 省市区
				},
				genderOptions: ['男', '女'],
				regionList: [],
				regionIndex: [0, 0, 0], // 默认选中第一项
				provinceList: [], // 省份列表
				cityList: [], // 市列表
				districtList: [], // 区列表
				cityData: chinaData,
				mainURI: "/api/fortune/"
			};
		},
		created() {
			// 初始化省市区数据
			const provinces = Object.keys(this.cityData);
			this.provinceList = provinces;
			this.cityList = this.cityData[provinces[0]] ? Object.keys(this.cityData[provinces[0]]) : [];
			this.districtList = this.cityData[provinces[0]] && this.cityData[provinces[0]][this.cityList[0]] || [];

			this.regionList = [this.provinceList, this.cityList, this.districtList];
		},
		methods: {
			// 选择性别
			selectGender(e) {
				this.userInfo.gender = this.genderOptions[e.detail.value];
			},
			// 选择生日
			selectBirthday(e) {
				this.userInfo.birthday = e.detail.value;
			},
			// 选择出生时间
			selectBirthTime(e) {
				this.userInfo.birthTime = e.detail.value;
			},
			// 选择省市区
			selectRegion(e) {
				this.regionIndex = e.detail.value;
				const selectedProvince = this.provinceList[this.regionIndex[0]];
				const selectedCity = this.cityList[this.regionIndex[1]];
				const selectedDistrict = this.districtList[this.regionIndex[2]];
				this.userInfo.region = [
					this.regionList[0][e.detail.value[0]],
					this.regionList[1][e.detail.value[1]],
					this.regionList[2][e.detail.value[2]]
				];

				// 更新市和区的数据
				this.cityList = Object.keys(this.cityData[selectedProvince]);
				this.districtList = this.cityData[selectedProvince][selectedCity];
				this.regionList = [this.provinceList, this.cityList, this.districtList];
			},
			// 提交表单
			submitForm() {
				if (!this.userInfo.gender || !this.userInfo.birthday || !this.userInfo.region.length) {
					uni.showToast({
						title: '请填写完整信息',
						icon: 'none'
					});
					return;
				}
				this.getResult()
				uni.showToast({
					title: '提交成功',
					icon: 'success'
				});
			},

			// 请求账单信息
			getBill() {
				uni.request({
					url: this.mainURI + 'key/', // 接口地址
					method: 'POST', // 请求方法，GET 或 POST
					data: {
						fortune_key: "test"
					},
					header: {
						'content-type': 'application/json' // 请求头
					},
					success: (res) => {
						console.log('请求成功', res.fortune);
					},
					fail: (err) => {
						// 请求失败时的回调
						console.log('请求失败', err);
						uni.showToast({
							title: '请求失败，请稍后再试',
							icon: 'none'
						});
					},
					complete: () => {
						// 请求完成时的回调（无论成功或失败都会执行）
						console.log('请求完成');
					}
				});

			},

			// 请求测试结果
			getResult() {
				// 组合日期和时间
				const birthDateTime = `${this.userInfo.birthday} ${this.userInfo.birthTime}:00`;
				uni.request({
					url: this.mainURI, // 接口地址
					method: 'POST', // 请求方法，GET 或 POST
					data: {
						gender: this.userInfo.gender,
						birth_time: birthDateTime,
						birth_place: `中国${this.userInfo.region.join("")}`
					},
					header: {
						'content-type': 'application/json' // 请求头
					},
					success: (res) => {
						// 请求成功时的回调
						if (res.statusCode === 200) {
							console.log('请求成功', res.data); // res.data 包含服务器返回的数据
							// 你可以在这里处理返回的数据，例如更新页面的状态
						} else {
							console.log('接口请求失败', res);
						}
					},
					fail: (err) => {
						// 请求失败时的回调
						console.log('请求失败', err);
						uni.showToast({
							title: '请求失败，请稍后再试',
							icon: 'none'
						});
					},
					complete: () => {
						// 请求完成时的回调（无论成功或失败都会执行）
						console.log('请求完成');
					}
				});

			}
		}
	};
</script>

<style>
	.container {
		padding: 20rpx;
	}

	.form-item {
		display: flex;
		align-items: center;
		margin-bottom: 20rpx;
	}

	.label {
		width: 200rpx;
		font-size: 32rpx;
	}

	.picker-text {
		flex: 1;
		font-size: 28rpx;
		padding: 10rpx;
		border: 1px solid #ccc;
		border-radius: 8rpx;
	}

	button {
		margin-top: 30rpx;
	}
</style>