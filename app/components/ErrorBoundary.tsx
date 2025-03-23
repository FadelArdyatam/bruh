import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { 
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can also log the error to an error reporting service
    console.log('Error caught by ErrorBoundary:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <ScrollView style={styles.container}>
          <View style={styles.errorContainer}>
            <Text style={styles.header}>Oops! Terjadi Kesalahan</Text>
            <Text style={styles.errorMessage}>{this.state.error?.toString()}</Text>
            
            <Text style={styles.stackTraceHeader}>Detail Kesalahan:</Text>
            <ScrollView style={styles.stackTraceContainer}>
              <Text style={styles.stackTrace}>
                {this.state.errorInfo?.componentStack || 'Tidak ada detail stack trace'}
              </Text>
            </ScrollView>
            
            <TouchableOpacity style={styles.button} onPress={this.resetError}>
              <Text style={styles.buttonText}>Coba Lagi</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa'
  },
  errorContainer: {
    padding: 20,
    marginTop: 50
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#dc3545',
    marginBottom: 10
  },
  errorMessage: {
    fontSize: 16,
    color: '#343a40',
    marginBottom: 20
  },
  stackTraceHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  stackTraceContainer: {
    maxHeight: 300,
    backgroundColor: '#343a40',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20
  },
  stackTrace: {
    color: '#f8f9fa',
    fontFamily: 'monospace'
  },
  button: {
    backgroundColor: '#FFB800',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16
  }
});

export default ErrorBoundary;