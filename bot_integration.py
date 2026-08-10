"""
WorldWar Bot - Subscription Integration Module
This module connects the Telegram bot to the subscription website
"""

import os
import json
import requests
import logging
from datetime import datetime, timedelta
from typing import Dict, Optional

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class SubscriptionManager:
    """Manages user subscriptions and validates access"""
    
    def __init__(self, api_base_url: str, api_key: str):
        self.api_base_url = api_base_url.rstrip('/')
        self.api_key = api_key
        self.headers = {
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json'
        }
    
    def get_user_subscription(self, telegram_id: int) -> Optional[Dict]:
        """Get user subscription data from API"""
        try:
            response = requests.get(
                f'{self.api_base_url}/api/user/{telegram_id}',
                headers=self.headers,
                timeout=5
            )
            
            if response.status_code == 200:
                return response.json()
            elif response.status_code == 404:
                logger.info(f'User {telegram_id} not subscribed')
                return None
            else:
                logger.error(f'API error: {response.status_code}')
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f'Request error: {e}')
            return None
    
    def create_subscription(self, telegram_id: int, email: str, plan: str) -> Optional[Dict]:
        """Create new subscription"""
        try:
            payload = {
                'telegramId': str(telegram_id),
                'email': email,
                'plan': plan
            }
            
            response = requests.post(
                f'{self.api_base_url}/api/subscribe',
                json=payload,
                headers=self.headers,
                timeout=5
            )
            
            if response.status_code == 201:
                logger.info(f'Subscription created for {telegram_id}')
                return response.json()
            else:
                logger.error(f'Subscription creation failed: {response.text}')
                return None
                
        except requests.exceptions.RequestException as e:
            logger.error(f'Request error: {e}')
            return None
    
    def upgrade_subscription(self, telegram_id: int, new_plan: str) -> bool:
        """Upgrade user subscription"""
        try:
            payload = {'newPlan': new_plan}
            response = requests.post(
                f'{self.api_base_url}/api/user/{telegram_id}/upgrade',
                json=payload,
                headers=self.headers,
                timeout=5
            )
            
            return response.status_code == 200
            
        except requests.exceptions.RequestException as e:
            logger.error(f'Upgrade error: {e}')
            return False
    
    def check_subscription_valid(self, telegram_id: int) -> bool:
        """Check if subscription is active and valid"""
        user = self.get_user_subscription(telegram_id)
        
        if not user:
            return False
        
        if not user.get('active'):
            return False
        
        # Check expiration
        if 'subscriptionEnd' in user:
            end_date = datetime.fromisoformat(user['subscriptionEnd'].replace('Z', '+00:00'))
            if end_date < datetime.now(end_date.tzinfo):
                return False
        
        return True
    
    def get_plan_features(self, plan: str) -> Dict:
        """Get features for a specific plan"""
        features = {
            'free': {
                'empires': 1,
                'apiAccess': False,
                'customMaps': False,
                'vipSupport': False,
                'advancedStats': False,
                'diplomaticAlliances': False
            },
            'pro': {
                'empires': 5,
                'apiAccess': False,
                'customMaps': True,
                'vipSupport': True,
                'advancedStats': True,
                'diplomaticAlliances': True
            },
            'elite': {
                'empires': 15,
                'apiAccess': True,
                'customMaps': True,
                'vipSupport': True,
                'advancedStats': True,
                'diplomaticAlliances': True,
                'legendaryLeader': True,
                'privateServer': True
            }
        }
        return features.get(plan, features['free'])


class PaymentHandler:
    """Handles payment callbacks and verification"""
    
    def __init__(self, api_base_url: str):
        self.api_base_url = api_base_url.rstrip('/')
    
    def verify_zarinpal_payment(self, authority: str, amount: int, api_key: str) -> bool:
        """Verify Zarinpal payment"""
        try:
            payload = {
                'merchant_id': api_key.split(':')[0],
                'amount': amount * 1000,
                'authority': authority
            }
            
            response = requests.post(
                'https://api.zarinpal.com/pg/v4/payment/verify.json',
                json=payload,
                timeout=10
            )
            
            if response.status_code == 200:
                return response.json().get('data', {}).get('code') == 100
            
            return False
            
        except Exception as e:
            logger.error(f'Zarinpal verification error: {e}')
            return False
    
    def process_payment_callback(self, telegram_id: int, plan: str, 
                                amount: int, gateway: str, 
                                transaction_id: str) -> bool:
        """Process payment callback"""
        try:
            payload = {
                'telegramId': str(telegram_id),
                'plan': plan,
                'amount': amount,
                'gateway': gateway,
                'transactionId': transaction_id,
                'timestamp': datetime.now().isoformat()
            }
            
            response = requests.post(
                f'{self.api_base_url}/api/payment/process',
                json=payload,
                timeout=10
            )
            
            return response.status_code == 200
            
        except Exception as e:
            logger.error(f'Payment processing error: {e}')
            return False


class BotIntegration:
    """Main bot integration class"""
    
    def __init__(self, website_url: str, api_key: str):
        self.website_url = website_url.rstrip('/')
        self.subscription_manager = SubscriptionManager(website_url, api_key)
        self.payment_handler = PaymentHandler(website_url)
    
    def get_user_commands(self, telegram_id: int) -> Dict[str, any]:
        """Get available commands based on subscription"""
        user = self.subscription_manager.get_user_subscription(telegram_id)
        
        commands = {
            'start': '🎮 شروع بازی',
            'help': '❓ کمک',
            'stats': '📊 آمار',
            'empire': '🏰 امپراتوری من',
            'shop': '🛒 فروشگاه'
        }
        
        if user and user.get('active'):
            plan = user.get('plan', 'free')
            
            if plan in ['pro', 'elite']:
                commands['maps'] = '🗺️ نقشه‌های سفارشی'
                commands['alliance'] = '⚔️ اتحادها'
                commands['market'] = '💰 بازار'
            
            if plan == 'elite':
                commands['diplomatic'] = '🕊️ دبیرخانه'
                commands['api'] = '🔌 API'
                commands['vip'] = '👑 VIP'
        
        return commands
    
    def generate_payment_link(self, telegram_id: int, plan: str) -> Optional[str]:
        """Generate payment link for subscription"""
        try:
            response = requests.post(
                f'{self.website_url}/api/generate-payment-link',
                json={
                    'telegramId': str(telegram_id),
                    'plan': plan
                },
                timeout=5
            )
            
            if response.status_code == 200:
                return response.json().get('paymentLink')
            
            return None
            
        except Exception as e:
            logger.error(f'Payment link generation error: {e}')
            return None
    
    def get_subscription_info_message(self, telegram_id: int) -> str:
        """Get formatted subscription info message"""
        user = self.subscription_manager.get_user_subscription(telegram_id)
        
        if not user:
            return (
                '❌ شما هنوز اشتراک ندارید\n\n'
                '📱 برای شروع بازی، به سایت ما بروید:\n'
                f'{self.website_url}'
            )
        
        plan = user.get('plan', 'unknown').upper()
        active = user.get('active', False)
        
        if not active:
            return f'⚠️ اشتراک شما منقضی شده است\n\nلطفاً تمدید کنید: {self.website_url}'
        
        sub_end = user.get('subscriptionEnd', 'نامعلوم')
        empires = user.get('activeEmpires', 0)
        max_empires = user.get('maxEmpires', 1)
        
        message = f"""
✅ اشتراک فعال
━━━━━━━━━━━━━━━━━
📦 پلان: {plan}
📍 امپراتوری: {empires}/{max_empires}
⏰ تجدید: {sub_end}
━━━━━━━━━━━━━━━━━
"""
        
        features = self.subscription_manager.get_plan_features(plan.lower())
        if features.get('customMaps'):
            message += '✓ نقشه‌های سفارشی\n'
        if features.get('vipSupport'):
            message += '✓ پشتیبانی VIP\n'
        if features.get('apiAccess'):
            message += '✓ دسترسی API\n'
        
        return message
    
    def get_pricing_keyboard(self) -> str:
        """Get inline keyboard for pricing"""
        keyboard = {
            'inline_keyboard': [
                [
                    {'text': '🆓 رایگان', 'callback_data': 'plan_free'},
                    {'text': '🟦 حرفه‌ای', 'callback_data': 'plan_pro'}
                ],
                [
                    {'text': '⭐ الیت', 'callback_data': 'plan_elite'},
                    {'text': 'ℹ️ اطلاعات', 'url': f'{self.website_url}/pricing'}
                ]
            ]
        }
        return json.dumps(keyboard)


# Example usage in bot handler:
"""
from bot_integration import BotIntegration

bot = BotIntegration(
    website_url='https://yourdomain.com',
    api_key='your_api_key'
)

@bot.message_handler(commands=['start'])
def handle_start(message):
    telegram_id = message.chat.id
    
    if not bot.subscription_manager.check_subscription_valid(telegram_id):
        # User not subscribed
        payment_link = bot.generate_payment_link(telegram_id, 'pro')
        bot.send_message(
            telegram_id,
            f'سلام! برای بازی بیشتر:\n{payment_link}'
        )
    else:
        # User subscribed
        info = bot.get_subscription_info_message(telegram_id)
        bot.send_message(telegram_id, info)

@bot.message_handler(commands=['status'])
def handle_status(message):
    telegram_id = message.chat.id
    info = bot.get_subscription_info_message(telegram_id)
    bot.send_message(telegram_id, info)
"""
