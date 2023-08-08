import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';

const TermsAndConditions = ({ onAccept }) => {
  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, textAlign: 'center', textDecorationLine: 'underline' }}>
        Terms and Conditions
      </Text>

      <Text style={{ marginTop: 20 }}>
        Welcome to our todo app! These terms and conditions ("Terms") govern your use of our app and any related services provided by us. Please read these Terms carefully before using our app, as they affect your legal rights and obligations.
      </Text>

      <Text style={{ marginTop: 10 }}>
        1.Acceptance of Terms
      </Text>
      <Text>
        By accessing or using our app, you agree to be bound by these Terms. If you do not agree to these Terms, you may not use our app.
      </Text>

      <Text style={{ marginTop: 10 }}>
        2.Account Registration
      </Text>
      <Text>
        To use our app, you must create an account. You must provide accurate and complete information during the registration process and keep your account information updated. You are responsible for maintaining the confidentiality of your account and password and for restricting access to your account.
      </Text>

      <Text style={{ marginTop: 10 }}>
        3.User Conduct
      </Text>
      <Text>
        You agree to use our app for lawful purposes only and in accordance with these Terms. You will not:
      </Text>
      <Text>
        - Violate any applicable laws or regulations
      </Text>
      <Text>
        - Infringe upon the rights of others
      </Text>
      <Text>
        - Use our app to distribute unsolicited commercial messages or spam
      </Text>
      <Text>
        - Attempt to gain unauthorized access to our app or its related systems
      </Text>

      <Text style={{ marginTop: 10 }}>
        4.Content
      </Text>
      <Text>
        You retain ownership of any content you submit or upload to our app. By using our app, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, and distribute your content for the purposes of providing and improving our app.
      </Text>

      <Text style={{ marginTop: 10 }}>
        5.Intellectual Property Rights
      </Text>
      <Text>
        Our app and its content, including but not limited to text, graphics, logos, icons, and images, are the property of our company and are protected by applicable intellectual property laws. You may not use, reproduce, modify, or distribute our app's content without our prior written permission.
      </Text>

      <Text style={{ marginTop: 10 }}>
        6.Third-Party Links
      </Text>
      <Text>
        Our app may contain links to third-party websites or services that are not owned or controlled by us. We are not responsible for the content or practices of any linked third-party websites or services. Your use of such websites or services is at your own risk.
      </Text>

      <Text style={{ marginTop: 10 }}>
        7.Disclaimer of Warranties
      </Text>
      <Text>
        Our app is provided on an "as is" and "as available" basis, without warranties of any kind, whether express or implied. We do not warrant that our app will be error-free, uninterrupted, or secure.
      </Text>

      <Text style={{ marginTop: 10 }}>
        8.Limitation of Liability
      </Text>
      <Text>
        To the fullest extent permitted by law, we shall not be liable for any direct, indirect, incidental, special, consequential, or exemplary damages, including but not limited to damages for loss of profits, goodwill, use, data, or other intangible losses arising out of or in connection with your use of our app.
      </Text>

      <Text style={{ marginTop: 10 }}>
        9.Indemnification
      </Text>
      <Text>
        You agree to indemnify and hold us harmless from any claims, damages, losses, liabilities, costs, and expenses arising out of or in connection with your use of our app or any breach of these Terms.
      </Text>

      <Text style={{ marginTop: 10 }}>
        10.Modification and Termination
      </Text>
      <Text>
        We reserve the right to modify or terminate our app or these Terms at any time, without notice. You are responsible for regularly reviewing these Terms to stay updated on any changes.
      </Text>

      <Text style={{ marginTop: 10 }}>
        11.Governing Law
      </Text>
      <Text>
        These Terms shall be governed by and construed in accordance with the laws of [your country or state], without regard to its conflict of laws principles.
      </Text>

      <Text style={{ marginTop: 10 }}>
        12.Entire Agreement
      </Text>
      <Text>
        These Terms constitute the entire agreement between you and us regarding the use of our app and supersede all prior agreements and understandings.
      </Text>

      {/* Button */}
      <TouchableOpacity
        onPress={onAccept}
        style={{
          backgroundColor: '#007260',
          borderRadius: 8,
          paddingVertical: 12,
          marginTop: 20,
          alignItems: 'center',
        }}
      >
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>
          I Agree
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default TermsAndConditions;
